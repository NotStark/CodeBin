import { z } from 'zod';

export const createPasteSchema = z.object({
    body: z.object({
        key: z.string(),
        content: z.string(),
        settings: z.object({
            language: z.string(),
            editable: z.boolean(),
            expireAt: z.number(),
        })
    }).deepPartial() // deepPartial will make all properties optional and not required -> currently depricated with no alternative
})

export const getPasteSchema = z.object({
    params: z.object({
        key: z.string()
    })
})

export type createPasteSchemaType = z.infer<typeof createPasteSchema>['body']
export type getPasteSchemaType = z.infer<typeof getPasteSchema>['params']