import React, { useCallback, useState } from 'react'
import type { Moment } from 'moment'
import { Button, DatePicker, Divider, Form, Input, InputNumber, Radio, Select, Switch, TreeSelect } from 'antd'

const BasicFormPage: React.FC = () => {
  const [form] = Form.useForm()
  const [formValueJson, setFormValueJson] = useState('')

  const formItems = [
    {
      label: 'Input',
      name: 'input',
      component: (
        <Input />
      )
    },
    {
      label: 'Input Number',
      name: 'inputNumber',
      component: (
        <InputNumber />
      )
    },
    {
      label: 'Single Date',
      name: 'singleDate',
      component: (
        <DatePicker />
      )
    },
    {
      label: 'Date Range',
      name: 'dateRange',
      component: (
        <DatePicker.RangePicker />
      )
    },
    {
      label: 'Radio Group',
      name: 'radioGroup',
      component: (
        <Radio.Group options={[
          { label: 'Apple', value: 'apple' },
          { label: 'Orange', value: 'orange' },
          { label: 'Banana', value: 'banana' },
        ]} />
      )
    },
    {
      label: 'Radio Button Group',
      name: 'radioButtonGroup',
      component: (
        <Radio.Group optionType="button" options={[
          { label: 'Coca Cola', value: 'coca cola' },
          { label: 'Pepsi', value: 'pepsi' },
          { label: 'Spirit', value: 'spirit' },
        ]} />
      )
    },
    {
      label: 'Select',
      name: 'select',
      component: (
        <Select>
          <Select.Option key="coffee">Coffee</Select.Option>
          <Select.Option key="oat milk">Oat Milk</Select.Option>
          <Select.Option key="tea">Tea</Select.Option>
        </Select>
      )
    },
    {
      label: 'Search Select',
      name: 'searchSelect',
      component: (
        <Select showSearch>
          <Select.Option key="robusta">Robusta</Select.Option>
          <Select.Option key="arabica">Arabica</Select.Option>
        </Select>
      )
    },
    {
      label: 'Switch',
      name: 'switch',
      component: (
        <Switch />
      )
    },
    {
      label: 'TreeSelect',
      name: 'treeSelect',
      component: (
        <TreeSelect treeData={[
          {
            title: 'node-1',
            value: '1',
            children: [
              {
                title: 'node-1-1',
                value: '1-1',
                children: [
                  {
                    title: 'node-1-1-1',
                    value: '1-1-1',
                  }
                ]
              }
            ]
          },
          {
            title: 'node-2',
            value: '2',
            children: [
              {
                title: 'node-2-1',
                value: '2-1'
              }
            ]
          }
        ]} />
      )
    }
  ]

  const handleSubmit = useCallback(() => {
    if (form) {
      const values = form.getFieldsValue()

      console.log(values)

      setFormValueJson(JSON.stringify({
        ...values,
        singleDate: values.singleDate.format('YYYY-MM-DD'),
        dateRange: values.dateRange.map((date: Moment) => date.format('YYYY-MM-DD'))
      }))
    }
  }, [])

  return (
    <div className="page-wrapper">
      <Form form={form}>
        {formItems.map(item => (
          <Form.Item label={item.label} name={item.name}>
            {item.component}
          </Form.Item>
        ))}
      </Form>

      <Button onClick={handleSubmit}>Submit</Button>

      <Divider />

      <div id="form-value-json">
        {formValueJson}
      </div>
    </div>
  )
}

export default BasicFormPage
