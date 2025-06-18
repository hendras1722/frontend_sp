'use client'

import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { cn } from '@/utils/lib'
import ArrayMap from './ArrayMap'
import { If, Else } from './if'

interface Fields {
  key: string
  label: string
  width?: string
  class?: string
}

interface FieldsWithRender<T> extends Fields {
  render?: (item: T, index: number) => React.ReactElement
}

interface TableDemoProps<T> {
  fields: FieldsWithRender<T>[]
  items: T[]
  classRow?: string
  classCol?: string
  footerContent?: React.ReactElement
}

export function TableDemo<T extends Record<string, any>>({
  fields,
  items,
  classRow,
  classCol,
  footerContent,
}: Readonly<TableDemoProps<T>>) {
  return (
    <Table>
      <TableHeader>
        <TableRow className={cn(classRow)}>
          <ArrayMap
            of={fields}
            render={(field, index) => (
              <TableHead
                key={'head' + index}
                className={cn(field.class, 'w-fit')}
                style={{ width: field.width }}
              >
                {field.label}
              </TableHead>
            )}
          />
        </TableRow>
      </TableHeader>
      <TableBody>
        <ArrayMap
          of={items}
          render={(item, rowIndex) => (
            <TableRow key={'body' + rowIndex} className={cn(classRow)}>
              <ArrayMap
                of={fields}
                render={(field, colIndex) => (
                  <If key={'cel' + colIndex} condition={!!field.render}>
                    <TableCell className={cn(classCol, field.class)}>
                      {field.render?.(item, rowIndex)}
                    </TableCell>
                    <Else key={'cel' + colIndex}>
                      <TableCell className={cn(classCol, field.class)}>
                        {(item[field.key] as string) ?? '-'}
                      </TableCell>
                    </Else>
                  </If>
                )}
              />
            </TableRow>
          )}
        />
      </TableBody>
      <If condition={!!footerContent}>
        <TableFooter>
          <TableRow>
            <TableCell colSpan={fields.length}>{footerContent}</TableCell>
          </TableRow>
        </TableFooter>
      </If>
    </Table>
  )
}
