import { test } from '@playwright/test'
import AntdFormHelper, { AntdInputType } from '../src/antd-form-helper'
import dayjs from 'dayjs'
import { expect } from 'chai'

test('Basic test', async ({ page }) => {
  await page.goto(
    'https://rekit.github.io/antd-form-builder/examples-v4/#basic'
  )

  const formHelper = new AntdFormHelper(page)
  await formHelper.fillFormValues([
    {
      label: 'Input',
      type: AntdInputType.InputText,
      value: 'lorem ipsum',
    },
    {
      label: 'Checkbox',
      type: AntdInputType.CheckboxGroup,
      value: {
        Apple: true,
        Orange: false,
        Banana: true,
      },
    },
    {
      label: 'Select',
      type: AntdInputType.Select,
      value: 'Orange',
    },
    {
      label: 'Radio Group',
      type: AntdInputType.RadioGroup,
      value: 'Banana',
    },
    {
      label: 'Radio Button Group',
      type: AntdInputType.RadioGroup,
      value: 'Orange',
    },
    {
      label: 'Password',
      type: AntdInputType.InputText,
      value: '123456',
    },
    {
      label: 'Textarea',
      type: AntdInputType.TextArea,
      value: 'lorem ipsum\nlorem ipsum\nlorem ipsum',
    },
    {
      label: 'Number',
      type: AntdInputType.InputText,
      value: '123.45',
    },
    {
      label: 'Date Picker',
      type: AntdInputType.DatePicker,
      value: dayjs().format('YYYY-MM-DD'),
    },
  ])
})

test('Async Data Source', async ({ page }) => {
  await page.goto(
    'https://rekit.github.io/antd-form-builder/examples-v4/#async-data-source'
  )

  const formHelper = new AntdFormHelper(page)

  await formHelper.fillFormValues([
    {
      label: 'Country',
      type: AntdInputType.Select,
      value: 'France',
    },
    {
      label: 'City',
      type: AntdInputType.Select,
      value: 'Paris',
    },
  ])
})

test('Complex Layout', async ({ page }) => {
  await page.goto(
    'https://rekit.github.io/antd-form-builder/examples-v4/#complex-layout'
  )

  const formHelper = new AntdFormHelper(page)
  await formHelper.fillFormValues([
    {
      label: 'Address',
      exactLabel: true,
      type: AntdInputType.InputText,
      value: '123 Main St',
    },
    {
      label: 'Address2',
      exactLabel: true,
      type: AntdInputType.InputText,
      value: 'Apt. 2',
    },
    {
      label: 'City',
      type: AntdInputType.InputText,
      value: 'New York',
    },
    {
      label: 'Home Type',
      type: AntdInputType.Select,
      value: 'Apartment',
    },
    {
      label: 'Room Type',
      type: AntdInputType.Select,
      value: 'Shared',
    },
    {
      label: 'King',
      type: AntdInputType.InputText,
      value: '1',
    },
  ])
})

test('Form in Modal', async ({ page }) => {
  await page.goto(
    'https://rekit.github.io/antd-form-builder/examples-v4/#form-in-modal'
  )

  await page.click('button:has-text("New Item")')

  const formHelper = new AntdFormHelper(page)
  await formHelper.fillFormValues([
    {
      label: 'Name',
      type: AntdInputType.InputText,
      value: 'john smith',
    },
    {
      label: 'Description',
      type: AntdInputType.InputText,
      value: 'lorem ipsum',
    },
  ])
})

test('Test Web', async ({ page }) => {
  await page.goto('http://localhost:3000/#/form/basic')

  const formHelper = new AntdFormHelper(page)
  await formHelper.fillFormValues([
    {
      label: 'Input',
      exactLabel: true,
      type: AntdInputType.InputText,
      value: 'hello',
    },
    {
      label: 'Input Number',
      type: AntdInputType.InputText,
      value: '1.234',
    },
    {
      label: 'Single Date',
      type: AntdInputType.DatePicker,
      value: '2022-01-02',
    },
    {
      label: 'Date Range',
      type: AntdInputType.DateRangePicker,
      value: ['2022-01-02', '2022-04-03'],
    },
    {
      label: 'Radio Group',
      type: AntdInputType.RadioGroup,
      value: 'Banana',
    },
    {
      label: 'Radio Button Group',
      type: AntdInputType.RadioGroup,
      value: 'Pepsi',
    },
    {
      label: 'Select',
      exactLabel: true,
      type: AntdInputType.Select,
      value: 'Oat Milk',
    },
    {
      label: 'Search Select',
      type: AntdInputType.SearchSelect,
      value: 'Arabica',
    },
    {
      label: 'Switch',
      type: AntdInputType.Switch,
      value: true,
    },
    {
      label: 'TreeSelect',
      exactLabel: true,
      type: AntdInputType.TreeSelect,
      value: ['node-1', 'node-1-1', 'node-1-1-1'],
    },
  ])

  await page.click('button:has-text("Submit")')

  const resultJson = JSON.parse(
    await page.locator('#form-value-json').textContent()
  )
  expect(resultJson).to.eql({
    input: 'hello',
    inputNumber: 1.234,
    singleDate: '2022-01-02',
    dateRange: ['2022-01-02', '2022-04-03'],
    radioGroup: 'banana',
    radioButtonGroup: 'pepsi',
    select: 'oat milk',
    searchSelect: 'arabica',
    switch: true,
    treeSelect: '1-1-1',
  })
})
