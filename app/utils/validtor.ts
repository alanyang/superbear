import { withZod } from "@remix-validated-form/with-zod"
import { z } from 'zod'

export const SignupValidator = withZod(z.object({
  email: z.string().email(),
  name: z.string().min(2).max(36).optional().default(''),
  password: z.string().min(6).max(128)
}))

export const LoginValidator = withZod(
  z.object({
    email: z.string().email(),
    password: z.string().min(6).max(128),
    next: z.string().optional(), //redirect to
  })
)

export const PostValidator = withZod(
  z.object({
    title: z.string().min(8).max(1024),
    content: z.string().min(8).max(65535),
    tags: z.string().optional().refine(tags => {
      if (!tags) return true
      return tags.split(',').every(tag => tag.length > 1 && tag.length < 18)
    }, { message: 'Invalid tags' })
  })
)

export const CommentValidtor = withZod(
  z.object({
    content: z.string().min(5).max(4096)
  })
)