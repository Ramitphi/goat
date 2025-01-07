import { createToolParameters } from "@goat-sdk/core";
import { z } from "zod";

export class GetPostOwnerParameterSchema extends createToolParameters(
    z.object({
        postURL: z.string(),
    }),
) {}

export class TipParameters extends createToolParameters(
    z.object({
        to: z.string().describe("The address to transfer the token to"),
        amount: z.string().describe("The amount of tokens to transfer in base units"),
    }),
) {}

export class GetProfileIdParameterSchema extends createToolParameters(
    z.object({
        address: z.string(),
    }),
) {}

export class GetRecommendationParameterSchema extends createToolParameters(
    z.object({
        profileId: z.string(),
    }),
) {}

export class FormatUrlParameterSchema extends createToolParameters(
    z.object({
        handle: z.string(),
    }),
) {}

export const GetPostOwnerResponseSchema = z.object({
    publication: z.object({
        by: z.object({
            ownedBy: z.object({
                address: z.string(),
            }),
        }),
    }),
});

export const GetProfileIdResponseSchema = z.object({
    defaultProfile: z.object({
        id: z.string(),
    }),
});

export const GetProfileRecommendationsSchema = z.object({
    profileRecommendations: z.object({
        items: z.array(
            z.object({
                id: z.string(),
                handle: z.object({
                    fullHandle: z.string(),
                }),
            }),
        ),
    }),
});
