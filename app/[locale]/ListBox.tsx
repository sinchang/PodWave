import type { AriaListBoxOptions } from '@react-aria/listbox'
import type { Node } from '@react-types/shared'
import { CheckIcon } from 'lucide-react'
import * as React from 'react'
import { useListBox, useListBoxSection, useOption } from 'react-aria'
import type { ListState } from 'react-stately'

interface ListBoxProps extends AriaListBoxOptions<unknown> {
  listBoxRef?: React.RefObject<HTMLUListElement>
  state: ListState<unknown>
}

interface SectionProps {
  section: Node<unknown>
  state: ListState<unknown>
}

interface OptionProps {
  item: Node<unknown>
  state: ListState<unknown>
}

export function ListBox(props: ListBoxProps) {
  let ref = React.useRef<HTMLUListElement>(null)
  let { listBoxRef = ref, state } = props
  let { listBoxProps } = useListBox(props, state, listBoxRef)

  return (
    <ul
      {...listBoxProps}
      ref={listBoxRef}
      className="max-h-72 w-full overflow-auto outline-none"
    >
      {[...state.collection].map((item) =>
        item.type === 'section' ? (
          <ListBoxSection key={item.key} section={item} state={state} />
        ) : (
          <Option key={item.key} item={item} state={state} />
        )
      )}
    </ul>
  )
}

function ListBoxSection({ section, state }: SectionProps) {
  let { itemProps, headingProps, groupProps } = useListBoxSection({
    heading: section.rendered,
    'aria-label': section['aria-label'],
  })

  return (
    <>
      <li {...itemProps} className="pt-2">
        {section.rendered ? (
          <span
            {...headingProps}
            className="mx-3 text-xs font-bold uppercase text-gray-500"
          >
            {section.rendered}
          </span>
        ) : null}
        <ul {...groupProps}>
          {[...section.childNodes].map((node) => (
            <Option key={node.key} item={node} state={state} />
          ))}
        </ul>
      </li>
    </>
  )
}

function Option({ item, state }: OptionProps) {
  let ref = React.useRef<HTMLLIElement>(null)
  let { optionProps, isDisabled, isSelected, isFocused } = useOption(
    {
      key: item.key,
    },
    state,
    ref
  )

  let text = 'text-gray-700'
  if (isFocused || isSelected) {
    text = 'text-blue-600'
  } else if (isDisabled) {
    text = 'text-gray-200'
  }

  return (
    <li
      {...optionProps}
      ref={ref}
      className={`m-1 flex cursor-default items-center justify-between rounded-md px-2 py-2 text-sm outline-none ${text} ${
        isFocused ? 'bg-blue-100' : ''
      } ${isSelected ? 'font-bold' : ''}`}
    >
      {item.rendered}
      {isSelected ? (
        <CheckIcon aria-hidden="true" className="h-5 w-5 text-blue-600" />
      ) : null}
    </li>
  )
}
