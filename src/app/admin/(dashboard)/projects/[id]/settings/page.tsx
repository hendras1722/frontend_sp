'use client'

import ArrayMap from '@/components/ArrayMap'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { axiosFetch } from '@/utils/axios'
import { useClickOutside, useDebounce } from '@msa_cli/react-composable'
import { X } from 'lucide-react'
import { useParams, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

interface User {
  id: string
  email: string
  created_at: Date
}

export default function Project() {
  const [showMember, setShowMember] = useState(false)
  const [items, setItems] = useState<User[]>([])
  const [_, debouncedValue, setValue] = useDebounce('', 300)
  const [IdProject, setIdProject] = useState('')
  const [itemsMember, setItemsMember] = useState<{ user: { email: string } }[]>(
    []
  )

  const router = useRouter()

  const params = useParams()

  const handleClickOutside = (event: PointerEvent | FocusEvent) => {
    setShowMember(false)
  }

  const modalRef = useClickOutside<HTMLDivElement>(handleClickOutside, {
    ignore: ['.ignore-me'], // Optional CSS selectors or elements to ignore
    detectIframe: true, // Optional iframe detection
  })

  async function refresh() {
    const res = await axiosFetch.get<{ data: { user: User[] } }>('/user', {
      params: { email: debouncedValue },
    })
    setItems(res.data.user)
  }

  async function refreshMembership() {
    const res = await axiosFetch.get<{
      data: { membership: { user: { email: string } }[] }
    }>('/membership?projectId=' + params.id)
    setItemsMember(res.data.membership)
  }

  useEffect(() => {
    refresh()
    refreshMembership()
  }, [])

  async function handleChooseMember(item) {
    const payload = {
      userId: [item.id],
      projectId: params.id,
    }
    await axiosFetch.post('/membership', payload)
    refreshMembership()
    setShowMember(false)
  }

  async function handleRemoveMember(item) {
    await axiosFetch.delete('/membership/' + item.id)
    refreshMembership()

    // await deleteMember(item)
    // refreshMembership()
    // setShowMember(false)
  }

  async function deleteProject(item) {
    await axiosFetch.delete('/project/' + params.id)
    window.location.href = '/admin/dashboard'
  }

  useEffect(() => {
    refresh()
  }, [debouncedValue])

  return (
    <div>
      <div>Add Member to Project</div>
      <div className="flex gap-3">
        <div className="relative w-full">
          <Input
            onFocus={() => setShowMember(true)}
            onChange={(e) => {
              setValue(e.target.value)
            }}
          />
          {showMember && (
            <div
              ref={modalRef}
              className="absolute bg-white min-h-12 border border-gray-500 rounded-lg w-full mt-2"
            >
              <ArrayMap
                of={items ?? []}
                render={(item, index) => (
                  <div
                    onClick={() => handleChooseMember(item)}
                    key={index}
                    className={
                      'w-full hover:bg-slate-400 rounded-lg cursor-pointer hover:text-white'
                    }
                  >
                    <div className="first:mt-0 mt-3">
                      <div className="p-3 ">
                        <div>{item.email}</div>
                      </div>
                    </div>
                  </div>
                )}
              />
            </div>
          )}
        </div>
      </div>
      <div className="mt-5">
        <div>Daftar List</div>
        <div className="bg-white min-h-12 border border-gray-500 rounded-lg">
          <ArrayMap
            of={itemsMember ?? []}
            render={(item: { user: { email: string } }, index) => (
              <div
                key={index}
                className="p-3 flex items-center gap-3 justify-between"
              >
                <div className="flex gap-3 items-center">
                  <div className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center text-white">
                    {item.user.email.split('@')[0].slice(0, 1)}
                  </div>
                  <div> {item.user.email}</div>
                </div>
                <button onClick={() => handleRemoveMember(item)}>
                  <X color="#F48FB1" />
                </button>
              </div>
            )}
          />
        </div>
        <Button
          className="mt-3 bg-red-500 hover:bg-red-600 w-full"
          onClick={deleteProject}
        >
          Delete Project
        </Button>
        <Button
          className="mt-3 bg-transparent hover:bg-transparent w-full shadow-none text-black"
          onClick={() => router.back()}
        >
          Back
        </Button>
      </div>
    </div>
  )
}
