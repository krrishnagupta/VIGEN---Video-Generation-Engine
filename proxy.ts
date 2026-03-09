import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'
import { updateSession } from '@/utils/supabase/middleware'

const isPublicRoute = createRouteMatcher([
  '/',
  '/sign-in(.*)',
  '/sign-up(.*)'
])

export const proxy = clerkMiddleware(async (auth, request) => {
  if (!isPublicRoute(request)) {
    await auth.protect()
  }

  return updateSession(request)
})

export default proxy

export const config = {
  matcher: [
    '/((?!_next|.*\\..*).*)',
    '/(api|trpc)(.*)',
  ],
}