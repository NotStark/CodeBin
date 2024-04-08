import { z } from 'zod';

export const createPasteSchema = z.object({
    body: z.object({
        key: z.string().optional(),
        content: z.string(),
        settings: z.object({
            language: z.string().optional(),
            editable: z.boolean().optional(),
            expireAt: z.number().optional(),
        }).optional()
    })
})

export const getPasteSchema = z.object({
    params: z.object({
        key: z.string()
    })
})

export type createPasteSchemaType = z.infer<typeof createPasteSchema>['body']
export type getPasteSchemaType = z.infer<typeof getPasteSchema>['params']