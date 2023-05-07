'use server'

import { redirect } from 'next/navigation'

export default async function filterContributors(formData: FormData) {
  const term = formData.get('search')
  if (term) {
    redirect(`/c?search=${term}`)
  }
}
