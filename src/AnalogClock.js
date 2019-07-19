import  { Component } from 'react';
import { ClockContainer, ClockBaseBorder, ClockBase, ClockCenter } from './ClockComponents';
import Hand from './Hand.js';
import DigitalClock from './DigitalClock';
import { Select,Spin } from 'antd';
import React, { getGlobal } from "reactn";

const { Option } = Select;


class AnalogClock extends Component {

    state = {
        seconds: '',
        minutes: '',
        hours: '',
        offset: '',
        selectValue: "",
        timezoneList: [],
        clockList : [],
        id: null,
        ampm: null,
        loading: false
    };


    constructor(props) {

        super(props);
       let timeZonevalue =  Intl.DateTimeFormat().resolvedOptions().timeZone;

        let date = new Date(new Date().toLocaleString("en-US", {timeZone: timeZonevalue}));
        this.state = {
            seconds: date.getSeconds(),
            minutes: date.getMinutes(),
            hours: date.getHours() > 12 ? date.getHours() - 12 : date.getHours(),
            ampm:  date.getHours() >= 12 ? 'pm' : 'am',
            offset: timeZonevalue,
            selectValue: "Analog",
            timezoneList: [],
            clockList : [],
            id: null
        }
    }

            componentDidMount() {
                try{
                    getGlobal().apexClass.getClockDetail((result, event) => {

                    this.id = result.Id;

                        if (result.Mutilit__Time_Zone__c !== undefined ) {
                           this.setState({offset: result.Mutilit__Time_Zone__c,selectValue: result.Mutilit__Clock_Type__c, id:result.Id })
                        }else{
                            let timeZonevalue =  Intl.DateTimeFormat().resolvedOptions().timeZone;
                            this.setState({offset: timeZonevalue,selectValue: result.Mutilit__Clock_Type__c,id:result.Id})
                        }
                    });
                }catch (e) {
                    console.log("err====",e);
                }
                try{
                    getGlobal().apexClass.getClockFields((result, event) => {
                        if (result) {
                            let timezones = [];
                            for (let i = 0 ; i<result.TimeZone.length; i++){
                               timezones.push({ value: result.TimeZone[i], name: result.TimeZone[i] })
                            }
                            this.setState({timezoneList: timezones});
                            let clockType = [];
                            for (let i = 0 ; i<result.ClockType.length; i++){
                                clockType.push({ value: result.ClockType[i], name: result.ClockType[i] })
                            }
                            this.setState({clockList: clockType})
                        }
                    });
                }catch (e) {
                    console.log("err====",e);
                }
                setInterval(() => {

                    let date = new Date(new Date().toLocaleString("en-US", {timeZone: this.state.offset}));
                    this.setState({
                        seconds: date.getSeconds(),
                        minutes: date.getMinutes(),
                        hours: date.getHours() > 12 ? date.getHours() - 12 : date.getHours()
                    })
                }, 1000)
            }
            convertDate  (timezoneValue)  {

                let timezone = {Mutilit__Time_Zone__c: timezoneValue, id:this.state.id };

                getGlobal().apexClass.UpdateClockDetail(timezone, (result, event) => {

                });
                this.setState({offset: timezoneValue})
            };
            handleChange(e){
           let clockType = {Mutilit__Clock_Type__c: e, id:this.state.id };

                getGlobal().apexClass.UpdateClockDetail(clockType, (result, event) => {

                });
                console.log("e.target.value" , e);
                this.setState({selectValue:e});
            }
    render() {
                const { width, border, borderColor, baseColor, centerColor, handColors } = this.props;
                let slectedClock = null;
                if (this.state.selectValue === "Analog" ) {
                    slectedClock = (
                        <div>
                            <ClockContainer width={width}>
                                <ClockBaseBorder border={border} borderColor={borderColor}>
                                    <ClockBase baseColor={baseColor}>
                                        <ClockCenter centerColor={centerColor} />
                                        <Hand type="second" {...this.state} handColors={handColors} />
                                        <Hand type="minute" {...this.state} handColors={handColors} />
                                        <Hand type="hour" {...this.state} handColors={handColors} />
                                    </ClockBase>
                                </ClockBaseBorder>
                            </ClockContainer>
                        </div>
                    )
                }
                if (this.state.selectValue === "Digital" ) {
                    slectedClock = (
                        <DigitalClock
                            hours = {this.state.hours}
                            minutes = {this.state.minutes}
                            seconds = {this.state.seconds}
                            ampm = {this.state.ampm}
                        />
                    )
                }
                if (this.state.selectValue === "Both" ) {
                    slectedClock = (
                        <div>
                            <ClockContainer width={width}>
                                <ClockBaseBorder border={border} borderColor={borderColor}>
                                    <ClockBase baseColor={baseColor}>
                                        <ClockCenter centerColor={centerColor} />
                                        <Hand type="second" {...this.state} handColors={handColors} />
                                        <Hand type="minute" {...this.state} handColors={handColors} />
                                        <Hand type="hour" {...this.state} handColors={handColors} />
                                    </ClockBase>
                                </ClockBaseBorder>
                            </ClockContainer>
                            <br/>
                           <DigitalClock
                               hours = {this.state.hours}
                               minutes = {this.state.minutes}
                               seconds = {this.state.seconds}
                               ampm = {this.state.ampm}
                           />
                        </div>
                    )
                }

                return (
                    <div>
                        <Select
                            showSearch
                            style={{ width: 150 }}
                            placeholder="Select Clock"
                            value={this.state.selectValue}
                            onChange={(event)=> this.handleChange(event)}
                        >
                            {this.state.clockList.map((e, key) => {
                                return <Option key={key} value={e.value}>{e.name}</Option>;
                            })}
                        </Select>
                        <br/>
                        <br/>
                        <br/>
                        {slectedClock}
                        <br/>
                        <Select
                            showSearch
                            style={{ width: 150 }}
                            placeholder="Select Timezone"
                            value={this.state.offset}
                            onChange={(timezone) => this.convertDate(timezone)}
                        >
                            {this.state.timezoneList.map((e, key) => {
                                return <Option key={key} value={e.value}>{e.name}</Option>;
                            })}
                        </Select>
                    </div>
                )
            }

}

        export default AnalogClock;

