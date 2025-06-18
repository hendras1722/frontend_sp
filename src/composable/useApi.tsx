import useSWRMutation from 'swr/mutation'

export function useApi(key, path?, options?, config: RequestInit = {}) {
  return useSWRMutation(
    key,
    () =>
      fetch(path ?? key, {
        ...config,
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + localStorage.getItem('accessToken'),
        },
      }).then((res) => res.json()),
    options
  )
}

export function useApiMutation(key, path?, options?, config: RequestInit = {}) {
  const { trigger, isMutating } = useSWRMutation(
    key,
    () =>
      fetch(path ?? key, {
        ...config,
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + localStorage.getItem('accessToken'),
        },
      }).then((res) => res.json()),
    options
  )

  return { trigger, isMutating }
}
