'use client'

import ArrayMap from '@/components/ArrayMap'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { axiosFetch } from '@/utils/axios'
import { CircleChevronRight } from 'lucide-react'
import Link from 'next/link'
import { Suspense, useEffect, useState } from 'react'

interface Projects {
  id: string
  name: string
}

interface Owner {
  id: string
  email: string
}

export default function Dashboard() {
  const [projects, setProjects] = useState<Projects[]>([])
  const [payload, setPayload] = useState('')
  const [open, setOpen] = useState(false)
  async function getProjects() {
    const res = await axiosFetch.get<{ data: { project: any[] } }>('/project')
    setProjects(res?.data.project)
  }

  async function createProject() {
    try {
      await axiosFetch.post('/project', {
        name: payload,
      })
      getProjects()
      setOpen(false)
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    getProjects()
  }, [])
  return (
    <div>
      <div className="flex justify-between items-center">
        <h3>List Project</h3>
        <Button
          onClick={() => setOpen(true)}
          className="bg-green-700 px-2 py-1 rounded-lg text-white"
        >
          Create Project
        </Button>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Project</DialogTitle>
              <DialogDescription>
                <div>
                  <Input
                    onChange={(e) => setPayload(e.target.value)}
                    placeholder="Project Name"
                  />
                  <Button
                    onClick={() => createProject()}
                    className="mt-5 w-full bg-green-500 text-white rounded-lg"
                  >
                    Submit
                  </Button>
                </div>
              </DialogDescription>
            </DialogHeader>
          </DialogContent>
        </Dialog>
      </div>
      <hr className="my-3" />
      <ArrayMap
        of={projects}
        render={(item, index) => (
          <Link
            href={`/admin/projects/${item?.id}`}
            key={index}
            className="border border-slate-500 p-3 rounded-lg mb-3 flex items-center justify-between"
          >
            <div>
              <h5>{item?.name}</h5>
            </div>
            <CircleChevronRight />
          </Link>
        )}
      />
    </div>
  )
}
