import { Page } from '@playwright/test'
import dayjs from 'dayjs'
import PromiseQueue from './promise-queue'
import { Locator } from './types'

/**
 * Distinguish between the different types of inputs and different operations on them.
 */
export enum AntdInputType {
  InputText,
  TextArea,
  DatePicker,
  DateRangePicker,
  TimePicker,
  TimeRangePicker,
  Select,
  SearchSelect,
  CascadeSelect,
  TreeSelect,
  MultipleTreeSelect,
  CheckableTreeSelect,
  RadioGroup,
  CheckboxGroup,
}

/**
 * TreeSelect value
 */
export type TreeSelectValue = {
  // node's text value
  name: string
  // if the node should be selected
  select: boolean
  // node's children
  children: TreeSelectValue[]
}

export type FillFormItem<Type extends AntdInputType> = {
  type: Type
  value: Type extends
    | AntdInputType.InputText
    | AntdInputType.Select
    | AntdInputType.SearchSelect
    ? string
    : Type extends AntdInputType.DatePicker | AntdInputType.TimePicker
    ? string | Date
    : Type extends AntdInputType.DateRangePicker | AntdInputType.TimeRangePicker
    ? [string | Date, string | Date]
    : Type extends AntdInputType.CascadeSelect
    ? string[]
    : Type extends AntdInputType.CheckableTreeSelect
    ? TreeSelectValue[]
    : Type extends AntdInputType.CheckboxGroup
    ? Record<string, boolean>
    : any
}

/**
 * Antd form helper
 */
class AntdFormHelper {
  queue = new PromiseQueue()

  /**
   * Use to locate form
   */
  private formLocator: Locator

  /**
   * Customize the locator of the form item.
   * locateFormItem method will use this locator to locate the form item.
   * @param label form item's label
   * @param formLocator where to locate the form item
   */
  private customFormItemLocator?: (
    label: string,
    formLocator: Locator
  ) => Locator

  setFormLocator(formLocator: Locator) {
    this.formLocator = formLocator
  }

  setCustomFormItemLocator(
    customFormItemLocator: (label: string, formLocator: Locator) => Locator
  ) {
    this.customFormItemLocator = customFormItemLocator
  }

  constructor(
    public page: Page,
    formLocator?: Locator,
    customFormItemLocator?: (label: string, formLocator: Locator) => Locator
  ) {
    this.formLocator = formLocator || page.locator('form.ant-form')
    this.customFormItemLocator = customFormItemLocator
  }

  /**
   * locate the form item by label
   * @param label form item's label
   */
  locateFormItem(label: string) {
    if (this.customFormItemLocator) {
      return this.customFormItemLocator(label, this.formLocator)
    }
    return this.formLocator.locator(`.ant-form-item:has-text("${label}")`)
  }

  /**
   * fill multiple form items
   * will perform different actions depending on the input type
   * @param values FillFormItem list
   */
  async fillFormValues(
    values: ({ label: string } & FillFormItem<AntdInputType>)[]
  ) {
    values.forEach((item) => {
      this.queue.push(() => this.fillFormItem(item.label, item))
    })
    await this.queue.run()
  }

  /**
   * fill single form item
   * @param label form item's label
   * @param fill FillFormItem
   */
  async fillFormItem(label: string, fill: FillFormItem<AntdInputType>) {
    switch (fill.type) {
      case AntdInputType.InputText:
        await this.fillInputFormItem(
          label,
          fill as FillFormItem<AntdInputType.InputText>
        )
        break
      case AntdInputType.TextArea:
        await this.fillTextAreaFormItem(
          label,
          fill as FillFormItem<AntdInputType.InputText>
        )
        break
      case AntdInputType.DatePicker:
        await this.fillDateFormItem(
          label,
          fill as FillFormItem<AntdInputType.DatePicker>
        )
        break
      case AntdInputType.DateRangePicker:
        await this.fillDateRangeFormItem(
          label,
          fill as FillFormItem<AntdInputType.DateRangePicker>
        )
        break
      case AntdInputType.Select:
        await this.fillSelectFormItem(
          label,
          fill as FillFormItem<AntdInputType.Select>
        )
        break
      case AntdInputType.SearchSelect:
        await this.fillSearchSelectFormItem(
          label,
          fill as FillFormItem<AntdInputType.SearchSelect>
        )
        break
      case AntdInputType.CheckableTreeSelect:
        await this.fillTreeSelectFormItem(
          label,
          fill as FillFormItem<AntdInputType.CheckableTreeSelect>
        )
        break
      case AntdInputType.RadioGroup:
        await this.fillRadioGroupFormItem(
          label,
          fill as FillFormItem<AntdInputType.RadioGroup>
        )
        break
      case AntdInputType.CheckboxGroup:
        await this.fillCheckboxGroupFormItem(
          label,
          fill as FillFormItem<AntdInputType.CheckboxGroup>
        )
        break
      default:
        throw new Error(`input type: ${fill.type} not supported`)
    }
  }

  async fillInputFormItem(
    label: string,
    fill: FillFormItem<AntdInputType.InputText>
  ) {
    await this.locateFormItem(label).locator('input').fill(fill.value)
  }

  async fillTextAreaFormItem(
    label: string,
    fill: FillFormItem<AntdInputType.InputText>
  ) {
    await this.locateFormItem(label).locator('textarea').fill(fill.value)
  }

  async fillDateFormItem(
    label: string,
    fill: FillFormItem<AntdInputType.DatePicker>
  ) {
    const value =
      fill.value instanceof Date
        ? dayjs(fill.value).format('YYYY-MM-DD')
        : fill.value
    const input = await this.locateFormItem(label).locator('input')
    await input.dblclick()
    await input.fill(value)
    await input.press('Enter')
  }

  async fillDateRangeFormItem(
    label: string,
    fill: FillFormItem<AntdInputType.DateRangePicker>
  ) {
    const start =
      fill.value[0] instanceof Date
        ? dayjs(fill.value[0]).format('YYYY-MM-DD')
        : fill.value[0]
    const end =
      fill.value[1] instanceof Date
        ? dayjs(fill.value[1]).format('YYYY-MM-DD')
        : fill.value[1]

    const firstInput = this.locateFormItem(label).locator('input >> nth=0')
    await firstInput.dblclick()
    await firstInput.fill(start)
    await firstInput.press('Enter')

    const secondInput = this.locateFormItem(label).locator('input >> nth=1')
    await secondInput.dblclick()
    await secondInput.fill(end)
    await secondInput.press('Enter')
  }

  async fillSelectFormItem(
    label: string,
    fill: FillFormItem<AntdInputType.Select>
  ) {
    const selector = this.locateFormItem(label).locator('.ant-select-selector')
    await selector.click()
    const selectionDropdown = this.page.locator('.ant-select-dropdown')
    await selectionDropdown
      .locator(`.ant-select-item-option:has-text("${fill.value}")`)
      .click()
  }

  async fillSearchSelectFormItem(
    label: string,
    fill: FillFormItem<AntdInputType.SearchSelect>
  ) {
    const searchInput = this.locateFormItem(label).locator(
      '.ant-select-selection-search-input'
    )
    await searchInput.fill(fill.value)
    const selectionDropdown = this.page.locator('.ant-select-dropdown')
    await selectionDropdown
      .locator(`.ant-select-item-option:has-text("${fill.value}")`)
      .click()
  }

  async fillTreeSelectFormItem(
    label: string,
    fill: FillFormItem<AntdInputType.CheckableTreeSelect>
  ) {
    const selector = this.locateFormItem(label).locator('.ant-tree-select')
    await selector.click()
    const selectionDropdown = this.page.locator('.ant-tree-select-dropdown')
    const listHolder = selectionDropdown.locator(
      '.ant-select-tree-list-holder-inner'
    )

    async function checkValue(
      page: Page,
      value: TreeSelectValue,
      level: number
    ) {
      // ant-select-tree-indent-unit
      const optionNode = listHolder
        .locator(`> .ant-select-tree-treenode:has-text("${value.name}")`)
        .filter({
          has:
            level === 0
              ? undefined
              : page.locator(
                  `.ant-select-tree-indent-unit >> nth=${level - 1}`
                ),
        })
      await optionNode.waitFor()
      if (value.select) {
        await optionNode.evaluate((node: HTMLDivElement) => {
          const unCheckedBox = node.querySelector(
            '.ant-select-tree-checkbox:not(.ant-select-tree-checkbox-checked)'
          ) as HTMLElement
          if (unCheckedBox) {
            unCheckedBox.click()
          }
        })
      }

      if (value.children) {
        await optionNode.evaluate((node: HTMLDivElement) => {
          const closedSwitcher = node.querySelector(
            '.ant-select-tree-switcher.ant-select-tree-switcher_close'
          ) as HTMLElement
          if (closedSwitcher) {
            closedSwitcher.click()
          }
        })

        for (const child of value.children) {
          await checkValue(page, child, level + 1)
        }
      }
    }

    for (const value of fill.value) {
      await checkValue(this.page, value, 0)
    }

    // click outside to close dropdown
    await this.page.click('body', {
      position: {
        x: 0,
        y: 0,
      },
    })
  }

  async fillRadioGroupFormItem(
    label: string,
    fill: FillFormItem<AntdInputType.RadioGroup>
  ) {
    const radioGroup = this.locateFormItem(label).locator('.ant-radio-group')
    // check radio button style
    const radioWrapperClassname = await radioGroup.evaluate(
      (node: HTMLDivElement) => {
        if (node.querySelector('.ant-radio-button-wrapper')) {
          return 'ant-radio-button-wrapper'
        }
        return 'ant-radio-wrapper'
      }
    )
    await radioGroup
      .locator(`.${radioWrapperClassname}:has-text("${fill.value}")`)
      .click()
  }

  async fillCheckboxGroupFormItem(
    label: string,
    fill: FillFormItem<AntdInputType.CheckboxGroup>
  ) {
    const checkboxGroup = this.locateFormItem(label).locator(
      '.ant-checkbox-group'
    )
    Object.entries(fill.value).forEach(([label, checked]) => {
      this.queue.push(async () => {
        const wrapper = checkboxGroup.locator(
          `.ant-checkbox-wrapper:has-text("${label}")`
        )
        const currentChecked = await wrapper.evaluate((node) => {
          return node.classList.contains('ant-checkbox-wrapper-checked')
        })
        if (currentChecked !== checked) {
          await wrapper.click()
        }
      })
    })
    await this.queue.run()
  }

  // TODO clearFormItem
  // TODO formItemHadError
  // TODO formItemHadWarning
}

export default AntdFormHelper
