'use client'

import React, { Suspense, useEffect, useState } from 'react'
import interact from 'interactjs'
import ArrayMap from '@/components/ArrayMap'
import { If } from '@/components/if'
import { Button } from '@/components/ui/button'
import { CircleChevronLeft, EllipsisVertical } from 'lucide-react'
import { useParams, useRouter } from 'next/navigation'
import { axiosFetch } from '@/utils/axios'
import Component from '@/components/ModalFullscreen'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import Cookies from 'js-cookie'

const TODO = ['Todo', 'In-progress', 'Done']

const formSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  status: z.enum(['Todo', 'In-progress', 'Done']),
  projectId: z.string().uuid('Invalid projectId UUID'),
  assigneeId: z.string().uuid('Invalid assigneeId UUID'),
})

export default function Dashboard() {
  const [eventDay, setEventDay] = useState(1)
  const [hoveredDay, setHoveredDay] = useState<number | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [draggedTicketId, setDraggedTicketId] = useState(null)
  const params = useParams()
  const [memberships, setMemberships] = useState<any[]>([])

  const [open, setOpen] = useState(false)
  const [openCreate, setOpenCreate] = useState(false)
  type DetailProject = {
    owner?: {
      id: string
      [key: string]: any
    }
    [key: string]: any
  }
  const [detailProject, setDetailProject] = useState<DetailProject>({})

  const router = useRouter()
  const cookies = Cookies.get('me')

  async function getProject() {
    const res = await axiosFetch.get<{ data: { project: any } }>(
      '/project/' + params.id
    )
    setDetailProject(res.data.project)
  }

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      description: '',
      status: 'Todo',
      assigneeId: '',
      projectId: '',
    },
  })
  type Ticket = {
    id: string
    title: string
    description: string
    status: string
    created_at: string
    project: {
      id: string
      name: string
      ownerId: string
    }
    assignee: {
      id: string
      email: string
    }
  }

  const [tickets, setTickets] = useState<Ticket[]>([])

  const getMembership = async () => {
    const res = await axiosFetch.get<{ data: { membership: any[] } }>(
      '/membership?projectId=' + params.id
    )
    setMemberships(res?.data.membership)
  }

  const updateTask = async (e, idTicket) => {
    await axiosFetch.put('/task/' + idTicket, e)
  }

  async function mutate() {
    const res = await axiosFetch.get<{ data: { tasks: any[] } }>('/task', {
      params: { projectId: params.id },
    })
    form.setValue('projectId', params.id as string)
    setTickets(res?.data.tasks ?? [])
  }

  const updateTicketStatus = (ticketId, newStatus) => {
    const itemsTicket = tickets.find((item) => item.id === ticketId)
    if (!itemsTicket) return
    itemsTicket.status = newStatus

    updateTask(
      {
        ...itemsTicket,
        status: newStatus,
        projectId: itemsTicket.project.id,
        assigneeId: itemsTicket.assignee.id,
        assignee: undefined,
        project: undefined,
        created_at: undefined,
      },
      ticketId
    )
    // console.log(`Updated ticket ${ticketId} to status: ${newStatus}`)
  }

  useEffect(() => {
    interact('.tiket').unset()
    interact('.todo').unset()

    interact('.tiket').draggable({
      inertia: false,
      autoScroll: true,
      allowFrom: '.tiket',
      ignoreFrom: 'input, textarea, button, select, option',
      modifiers: [
        interact.modifiers.restrict({
          restriction: '.calendar-grid',
          endOnly: true,
        }),
      ],
      listeners: {
        start(event) {
          setIsDragging(true)
          const target = event.target
          const ticketId = target.getAttribute('data-ticket-id')
          setDraggedTicketId(ticketId)

          if (event.interaction.pointerType === 'touch') {
            event.preventDefault()
          }

          target.style.zIndex = '50'
          target.style.cursor = 'grabbing'
          target.style.transition = 'none'
          target.style.transform = 'scale(1.05)'
          target.style.boxShadow = '0 10px 30px rgba(0,0,0,0.3)'
          target.style.opacity = '0.9'
        },

        move(event) {
          const target = event.target
          const x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx
          const y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy

          target.style.transform = `translate(${x}px, ${y}px) scale(1.05)`
          target.setAttribute('data-x', x)
          target.setAttribute('data-y', y)
        },

        end(event) {
          setIsDragging(false)
          setDraggedTicketId(null)
          const target = event.target

          target.style.zIndex = '10'
          target.style.cursor = 'grab'
          target.style.transition = 'all 0.3s ease'
          target.style.opacity = '1'

          setTimeout(() => {
            if (!target.classList.contains('dropped')) {
              target.style.transform = 'translate(0px, 0px) scale(1)'
              target.style.boxShadow = ''
              target.setAttribute('data-x', 0)
              target.setAttribute('data-y', 0)
            } else {
              target.style.transform = 'scale(1)'
              target.style.boxShadow = ''
            }
          }, 50)
        },
      },
    })

    interact('.todo').dropzone({
      accept: '.tiket',
      overlap: 0.3,
      checker: (
        dragEvent,
        event,
        dropped,
        dropzone,
        dropElement,
        draggable,
        draggableElement
      ) => {
        return dropped
      },
      ondragenter(event) {
        const index = parseInt(event.target.getAttribute('data-index'))
        setHoveredDay(index)
        event.target.classList.add('ring-2', 'ring-blue-400', 'bg-blue-50')
      },
      ondragleave(event) {
        event.target.classList.remove('ring-2', 'ring-blue-400', 'bg-blue-50')
      },
      ondrop(event) {
        const index = parseInt(event.target.getAttribute('data-index'))
        const draggedElement = event.relatedTarget
        const newStatus = TODO[index]

        if (draggedTicketId) {
          updateTicketStatus(draggedTicketId, newStatus)
        }

        setEventDay(index)
        setHoveredDay(null)

        draggedElement.style.transition =
          'transform 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)'
        draggedElement.style.transform = 'translate(0px, 0px)'
        draggedElement.setAttribute('data-x', 0)
        draggedElement.setAttribute('data-y', 0)
        draggedElement.classList.add('dropped')

        event.target.classList.remove('ring-2', 'ring-blue-400', 'bg-blue-50')

        setTimeout(() => {
          draggedElement.classList.remove('dropped')
          draggedElement.style.transition = 'all 0.2s ease'
        }, 300)
      },
    })

    return () => {
      interact('.tiket').unset()
      interact('.todo').unset()
    }
  }, [eventDay, draggedTicketId])

  async function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values, 'inirelkiew')
    try {
      await axiosFetch.post('/task', values)
      setOpenCreate(false)
      mutate()
    } catch (error) {
      console.error('error', error)
    }
  }

  useEffect(() => {
    mutate()
    getMembership()
    getProject()
  }, [])

  useEffect(() => {
    if (!open) {
      router.push(`/admin/projects/${params.id}`)
    }
  }, [open])

  return (
    <div className="w-full mx-auto p-4">
      <div className="mb-5 flex justify-between items-center">
        <button
          className="bg-transparent hover:bg-transparent shadow-none"
          onClick={() => router.push('/admin/dashboard')}
        >
          <CircleChevronLeft color="#000" />
        </button>
        <div>
          {(cookies && JSON.parse(cookies).id) === detailProject.owner?.id && (
            <Button
              className="mr-2 bg-blue-500 hover:bg-blue-600"
              onClick={() =>
                router.push(`/admin/projects/${params.id}/settings`)
              }
            >
              Invite Member
            </Button>
          )}
          <Button
            onClick={() => setOpenCreate(true)}
            className="bg-green-700 px-2 py-1 rounded-lg text-white"
          >
            Create Project
          </Button>
          <Dialog open={openCreate} onOpenChange={setOpenCreate}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle className="mb-3">Add Project</DialogTitle>
                <DialogDescription>
                  <div>
                    <Form {...form}>
                      <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="space-y-8"
                      >
                        <FormField
                          control={form.control}
                          name="title"
                          render={({ field }) => (
                            <Suspense>
                              <FormItem>
                                <FormLabel>title</FormLabel>
                                <FormControl>
                                  <Input placeholder="Input" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            </Suspense>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="description"
                          render={({ field }) => (
                            <Suspense>
                              <FormItem>
                                <FormLabel>description</FormLabel>
                                <FormControl>
                                  <Input placeholder="Input" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            </Suspense>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="status"
                          render={({ field }) => (
                            <Suspense>
                              <FormItem>
                                <FormLabel>status</FormLabel>
                                <FormControl>
                                  <Select
                                    {...field}
                                    onValueChange={(e) => {
                                      form.setValue('status', e as any)
                                    }}
                                  >
                                    <SelectTrigger className="w-full">
                                      <SelectValue placeholder="Select" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="Todo">Todo</SelectItem>
                                      <SelectItem value="In-progress">
                                        In Progress
                                      </SelectItem>
                                      <SelectItem value="Done">Done</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            </Suspense>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="assigneeId"
                          render={({ field }) => (
                            <Suspense>
                              <FormItem>
                                <FormLabel>Assignee</FormLabel>
                                <FormControl>
                                  <Select
                                    {...field}
                                    onValueChange={(e) => {
                                      form.setValue('assigneeId', e as any)
                                    }}
                                  >
                                    <SelectTrigger className="w-full">
                                      <SelectValue placeholder="Select" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="all" disabled>
                                        choose picked
                                      </SelectItem>
                                      <ArrayMap
                                        of={memberships}
                                        render={(item) => (
                                          <SelectItem value={item.user.id}>
                                            {item.user.email}
                                          </SelectItem>
                                        )}
                                      />
                                    </SelectContent>
                                  </Select>
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            </Suspense>
                          )}
                        />
                        <Button
                          type="submit"
                          className="bg-green-500 hover:bg-green-600 w-full"
                        >
                          Submit
                        </Button>
                      </form>
                    </Form>
                  </div>
                </DialogDescription>
              </DialogHeader>
            </DialogContent>
          </Dialog>
        </div>
      </div>
      <div className="calendar-grid grid grid-cols-3 gap-2 bg-gray-100 p-4 rounded-lg">
        <ArrayMap
          of={TODO}
          render={(todo, index) => (
            <div
              key={index}
              data-index={index}
              className={`todo relative bg-white rounded-lg p-3 min-h-[200px] shadow-sm border-2 border-transparent transition-all duration-200 ${
                hoveredDay === index ? 'ring-2 ring-blue-400 bg-blue-50' : ''
              } ${
                isDragging && index !== eventDay
                  ? 'border-dashed border-gray-300'
                  : ''
              }`}
              style={{
                touchAction: 'none', // Important for touch drag
              }}
            >
              <div className="text-sm font-semibold mb-2 text-gray-700 border-b border-gray-200 pb-2">
                {todo}
              </div>
              <div className="space-y-2 mt-3">
                <ArrayMap
                  of={tickets}
                  render={(item, ticketIndex) => (
                    <If key={ticketIndex} condition={todo === item.status}>
                      <div
                        tabIndex={0}
                        role="button"
                        className="tiket bg-gradient-to-r from-cyan-500 to-blue-500 text-white p-3 rounded-lg shadow-lg cursor-grab z-10 transition-all duration-200 ease-out hover:shadow-xl hover:scale-[1.02] select-none relative mb-2"
                        data-ticket-id={item.id}
                        style={{
                          WebkitUserSelect: 'none',
                          MozUserSelect: 'none',
                          msUserSelect: 'none',
                          userSelect: 'none',
                          touchAction: 'none', // Critical for mobile drag
                          WebkitTouchCallout: 'none', // Disable iOS callout
                          WebkitTapHighlightColor: 'transparent', // Remove tap highlight
                          cursor: isDragging ? 'grabbing' : 'grab',
                        }}
                        // Add touch event handlers for better mobile support
                        onTouchStart={(e) => {
                          // Prevent default touch behaviors that might interfere
                          e.preventDefault()
                        }}
                        onContextMenu={(e) => {
                          // Prevent context menu on long press
                          e.preventDefault()
                        }}
                      >
                        <div className="text-sm font-bold mb-1">
                          {item.title}
                        </div>
                        <div className="text-xs opacity-90">
                          {item.project.name}
                        </div>
                        <div className="text-xs opacity-75 mt-1">
                          {item.assignee.email}
                        </div>
                        <div className="absolute top-1 right-1 text-xs opacity-60">
                          <Button
                            className="bg-transparent hover:bg-transparent hover:shadow-lg shadow-none w-fit"
                            onClick={() => {
                              router.push('?id=' + item.id)
                              setTimeout(() => {
                                setOpen(true)
                              }, 200)
                            }}
                          >
                            <EllipsisVertical />
                          </Button>
                        </div>
                      </div>
                    </If>
                  )}
                />
              </div>
            </div>
          )}
        />
      </div>
      <Component open={open} onOpenChange={setOpen} reFetch={mutate} />
    </div>
  )
}
