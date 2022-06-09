import { test } from '@playwright/test'
import AntdFormHelper, { AntdInputType } from '../src/antd-form-helper'
import dayjs from 'dayjs'

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
