'use client'

import type { AriaSelectProps } from '@react-types/select'
import { GlobeIcon } from 'lucide-react'
import { useLocale } from 'next-intl'
import { usePathname, useRouter } from 'next-intl/client';
import { Key, useRef, useTransition } from 'react'
import {
  HiddenSelect,
  mergeProps,
  useButton,
  useFocusRing,
  useSelect,
} from 'react-aria'
import { Item, useSelectState } from 'react-stately'

import { i18n } from '~/i18n'

import { ListBox } from './ListBox'
import { Popover } from './Popover'

export { Item } from 'react-stately'

export function Select<T extends object>(props: AriaSelectProps<T>) {
  // Create state based on the incoming props
  let state = useSelectState(props)

  // Get props for child elements from useSelect
  let ref = useRef(null)
  let { triggerProps, menuProps } = useSelect(props, state, ref)

  // Get props for the button based on the trigger props from useSelect
  let { buttonProps } = useButton(triggerProps, ref)

  let { focusProps } = useFocusRing()

  return (
    <div className="relative ml-2 inline-flex flex-row">
      <HiddenSelect
        state={state}
        triggerRef={ref}
        label={props.label}
        name={props.name}
      />
      <button
        {...mergeProps(buttonProps, focusProps)}
        ref={ref}
        className={`rounded-lg bg-stone-50 p-1.5 shadow-xl dark:bg-neutral-900`}
      >
        <GlobeIcon size="1rem" />
      </button>
      {state.isOpen && (
        <Popover
          state={state}
          triggerRef={ref}
          placement="bottom start"
          className="w-52"
        >
          <ListBox {...menuProps} state={state} />
        </Popover>
      )}
    </div>
  )
}

export function LanguageSwitcher() {
  const locale = useLocale()
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const pathname = usePathname();

  function onSelectChange(nextLocale: Key) {
    startTransition(() => {
      router.replace(pathname, { locale: nextLocale as string });
    });
  }

  return (
    <Select selectedKey={locale} label="Select a language" items={i18n.languages} onSelectionChange={onSelectChange} isDisabled={isPending}>
      {language => <Item key={language.locale}>{language.title}</Item>}
    </Select>
  )
}
