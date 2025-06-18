'use client'

import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogTitle } from './ui/dialog'

import { cn } from '@/utils/lib'
import { useClickOutside } from '@msa_cli/react-composable'
import { Settings } from 'lucide-react'
import { useParams, useRouter } from 'next/navigation'
import { useState, useEffect, Suspense } from 'react'
import { axiosFetch } from '@/utils/axios'

export default function Component({ open, onOpenChange, reFetch }) {
  const [showTodo, setShowTodo] = useState(false)
  type TaskData = {
    title?: string
    description?: string
    status: string
    project?: {
      id: string
      name: string
      owner?: {
        email?: string
      }
    }
    assignee?: {
      id: string
      email?: string
    }
  }
  const [data, setData] = useState<TaskData>({ status: '' })
  const params = useParams()
  const router = useRouter()
  const query = (typeof window !== 'undefined' &&
    new URLSearchParams(window.location.origin)) || {
    get: () => '',
    has: () => false,
  }

  const handleClickOutside = (event: PointerEvent | FocusEvent) => {
    setShowTodo(false)
  }

  const modalRef = (typeof window !== 'undefined' &&
    useClickOutside<HTMLDivElement>(handleClickOutside, {
      ignore: ['.ignore-me'], // Optional CSS selectors or elements to ignore
      detectIframe: true, // Optional iframe detection
    })) || {
    get: () => '',
    has: () => false,
  }
  const [status, setStatus] = useState('')

  async function refresh() {
    const res = await axiosFetch.get<{ data: { tasks: any } }>(
      '/task/' + query.get('id')
    )
    setData(res?.data.tasks)
    setStatus(res?.data.tasks?.status)
  }

  async function updateTodo(payload) {
    try {
      await axiosFetch.put('/task/' + query.get('id'), payload)
      return true
    } catch (error) {
      return false
    }
  }

  useEffect(() => {
    if (query.get('id')) refresh()
  }, [query.get('id')])

  async function handleUpdateStatus(newStatus) {
    try {
      setStatus(newStatus)

      const payload = {
        title: data?.title,
        description: data?.description,
        status: newStatus,
        projectId: data?.project?.id,
        assigneeId: data?.assignee?.id,
      }

      const res = await updateTodo(payload)
      if (res) {
        await refresh()
        await reFetch()
        setShowTodo(false)
      }

      console.log('Status updated to:', newStatus)
    } catch (error) {
      console.error('Error updating status:', error)
      setStatus(data?.status)
    }
  }

  async function DeleteProject() {
    try {
      await axiosFetch.delete('/task/' + query.get('id'))
      onOpenChange(false)
      reFetch()
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <Dialog defaultOpen open={open} onOpenChange={onOpenChange}>
      <DialogTitle></DialogTitle>
      <DialogContent className="sm:max-w-[760px] w-full min-h-[300px] flex flex-col">
        <div className="mt-5">
          <div className="flex items-center justify-between">
            <h5>{data?.title}</h5>
            <div className="flex justify-center items-center gap-3">
              <Button
                onClick={DeleteProject}
                className="bg-red-500 hover:bg-red-600 mr-1"
              >
                Delete Project
              </Button>
              <div className="relative">
                <Button
                  onClick={() => setShowTodo((prevState) => !prevState)}
                  className={cn(
                    ' p-2 rounded text-[10px] text-white font-bold w-[100px]',
                    status === 'Todo' && 'bg-gray-500 ',
                    status === 'In-progress' && 'bg-yellow-500',
                    status === 'Done' && 'bg-green-500 '
                  )}
                >
                  {status?.toUpperCase()}
                </Button>
                <div
                  ref={modalRef}
                  className={cn(
                    !showTodo && 'hidden',
                    'absolute top-9 border border-black rounded shadow-lg w-full z-10'
                  )}
                >
                  <ul>
                    {status !== 'Todo' && (
                      <button
                        onClick={() => handleUpdateStatus('Todo')}
                        className="w-full"
                      >
                        <li className="mb-2 hover:bg-gray-300 bg-white p-1 cursor-pointer hover:text-white rounded">
                          Todo
                        </li>
                      </button>
                    )}
                    {status !== 'In-progress' && (
                      <button
                        onClick={() => handleUpdateStatus('In-progress')}
                        className="w-full"
                      >
                        <li className="mb-2 hover:bg-gray-300 bg-white p-1 cursor-pointer hover:text-white rounded">
                          In-progress
                        </li>
                      </button>
                    )}
                    {status !== 'Done' && (
                      <button
                        onClick={() => handleUpdateStatus('Done')}
                        className="w-full"
                      >
                        <li className=" hover:bg-gray-300 bg-white p-1 cursor-pointer hover:text-white rounded">
                          Done
                        </li>
                      </button>
                    )}
                  </ul>
                </div>
              </div>
              <Button
                className="bg-transparent hover:bg-transparent hover:shadow-lg shadow-none"
                onClick={() =>
                  router.push('/admin/projects/' + params.id + '/settings')
                }
              >
                <Settings color="#000" />
              </Button>
            </div>
          </div>
          <small className="text-[10px]">
            {data?.project?.name} - {data?.project?.owner?.email}
          </small>
          <div className="mt-5">
            <p>{data?.description}</p>
            <div>assignee: {data?.assignee?.email}</div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

function XIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M18 6 6 18" />
      <path d="m6 6 12 12" />
    </svg>
  )
}
