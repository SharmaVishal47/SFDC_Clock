import {Form, Input, Icon, Button, Row, Col} from 'antd';
import "./DynamicFieldsSet.css";
import React from 'react';
import AnalogClock from "../AnalogClock";

let id = 0;

class DynamicFieldSet extends React.Component {





    constructor(props) {
        super(props);
        this.state = {
            options: {
                width: "100px",
                border: true,
                borderColor: "#2e2e2e",
                baseColor: "#17a2b8",
                centerColor: "#459cff",
                handColors: {
                    second: "#d81c7a",
                    minute: "#fff",
                    hour: "#fff"
                }
            }
        };
        this.customizeClock = this.customizeClock.bind(this);
    }

    customizeClock(options) {
        this.setState({ options: { ...options } });
    }


    remove = k => {
        const { form } = this.props;
        // can use data-binding to get
        const keys = form.getFieldValue('keys');
        // We need at least one passenger
        if (keys.length === 1) {
            return;
        }

        // can use data-binding to set
        form.setFieldsValue({
            keys: keys.filter(key => key !== k),
        });
    };

    add = () => {
        const { form } = this.props;
        // can use data-binding to get
        const keys = form.getFieldValue('keys');
        const nextKeys = keys.concat(id++);
        // can use data-binding to set
        // important! notify form to detect changes
        form.setFieldsValue({
            keys: nextKeys,
        });
    };

    handleSubmit = e => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                const { keys, names } = values;
                console.log('Received values of form: ', values);
                console.log('Merged values:', keys.map(key => names[key]));
            }
        });
    };

    render() {
        const { getFieldDecorator, getFieldValue } = this.props.form;
        const formItemLayout = {
            labelCol: {
                xs: { span: 24 },
                sm: { span: 4 },
            },
            wrapperCol: {
                xs: { span: 24 },
                sm: { span: 20 },
            },
        };
        const formItemLayoutWithOutLabel = {
            wrapperCol: {
                xs: { span: 24, offset: 0 },
                sm: { span: 20, offset: 4 },
            },
        };
        getFieldDecorator('keys', { initialValue: [] });
        const keys = getFieldValue('keys');
        const formItems = keys.map((k, index) => (
            <Form.Item
                {...(index === 0 ? formItemLayout : formItemLayoutWithOutLabel)}
                label={index === 0 ? '' : ''}
                required={false}
                key={k}
            >
                {getFieldDecorator(`names[${k}]`, {

                })(<div>
                    <Row>
                        <Col span={20} offset={4}>
                            <h4><i>Select Clock</i></h4>
                            <AnalogClock {...this.state.options} />
                        </Col>
                    </Row>
                </div>)}
                {keys.length > 1 ? (
                    <Icon
                        className="dynamic-delete-button"
                        type="minus-circle-o"
                        onClick={() => this.remove(k)}
                    />
                ) : null}
            </Form.Item>
        ));
        return (
            <Form onSubmit={this.handleSubmit}>
                {formItems}
                <Form.Item {...formItemLayoutWithOutLabel}>

                        <Icon type="plus" onClick={this.add} />

                </Form.Item>
                <Form.Item {...formItemLayoutWithOutLabel}>

                </Form.Item>
            </Form>
        );
    }
}

const WrappedDynamicFieldSet = Form.create({ name: 'dynamic_form_item' })(DynamicFieldSet);

export default WrappedDynamicFieldSet;
