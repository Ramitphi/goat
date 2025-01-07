import { Tool } from "@goat-sdk/core";
import { EVMWalletClient } from "@goat-sdk/wallet-evm";

import { z } from "zod";
import {
    FormatUrlParameterSchema,
    GetPostOwnerParameterSchema,
    GetPostOwnerResponseSchema,
    GetProfileIdParameterSchema,
    GetProfileIdResponseSchema,
    GetProfileRecommendationsSchema,
    GetRecommendationParameterSchema,
    TipParameters,
} from "./parameters";

import { parseEther } from "viem";

export class LensService {
    @Tool({
        description: "Get wallet address for creator of the given post",
    })
    async getWalletAddressofGivenPost(parameters: GetPostOwnerParameterSchema) {
        const link = parameters.postURL;
        const regex = /https:\/\/hey\.xyz\/posts\/(.*)/;
        const match = link.match(regex);

        if (!match) {
            throw new Error(`Please submit a valid link. Submitted link: ${link}`);
        }

        let postOwner: z.infer<typeof GetPostOwnerResponseSchema>;
        try {
            const response = await fetch("https://api-v2.lens.dev/", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    query: `query Publication($request: PublicationRequest!) {
                        publication(request: $request) {
                          ... on Post {
                            by {
                              ownedBy {
                                address
                              }
                            }
                          }
                        }
                      }`,
                    variables: {
                        request: {
                            forId: match[1],
                        },
                    },
                }),
            });

            postOwner = (await response.json()) as z.infer<typeof GetPostOwnerResponseSchema>;
        } catch (error) {
            throw new Error(`Failed to get NFT collection statistics: ${error}`);
        }

        return postOwner;
    }

    @Tool({
        description: "Tip this creator with an amount of grass token",
    })
    async tipTheCreator(walletClient: EVMWalletClient, parameters: TipParameters) {
        try {
            const to = await walletClient.resolveAddress(parameters.to);
            const hash = await walletClient.sendTransaction({
                to,
                value: parseEther(parameters.amount),
            });

            return `https://block-explorer.testnet.lens.dev/tx/${hash.hash}`;
        } catch (error) {
            throw Error(`Failed to transfer: ${error}`);
        }
    }

    @Tool({
        description: "Get the profileId of creator based on their address",
    })
    async getProfileId(parameters: GetProfileIdParameterSchema) {
        let profileId: z.infer<typeof GetProfileIdResponseSchema>;

        try {
            const response = await fetch("https://api-v2.lens.dev/", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    query: `query DefaultProfile($request: DefaultProfileRequest!) {
                        defaultProfile(request: $request) {
                          id
                        }
                      }`,
                    variables: {
                        request: {
                            for: parameters.address,
                        },
                    },
                }),
            });
            profileId = (await response.json()) as z.infer<typeof GetProfileIdResponseSchema>;
        } catch (error) {
            throw Error(`Failed to transfer: ${error}`);
        }
        return profileId;
    }

    @Tool({
        description: "Get similar creators for given profileId",
    })
    async getRecommendations(parameters: GetRecommendationParameterSchema) {
        let recommendation: z.infer<typeof GetProfileRecommendationsSchema>;

        try {
            const response = await fetch("https://api-v2.lens.dev/", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    query: `query ProfileRecommendations($request: ProfileRecommendationsRequest!) {
                        profileRecommendations(request: $request) {
                          items {
                            id
                            handle {
                              fullHandle
                            }
                          }
                        }
                      }`,
                    variables: {
                        request: {
                            for: parameters.profileId,
                        },
                    },
                }),
            });

            recommendation = (await response.json()) as z.infer<typeof GetProfileRecommendationsSchema>;
        } catch (error) {
            throw Error(`Failed to transfer: ${error}`);
        }
        return recommendation;
    }

    @Tool({
        description: "Format the lens handle with url",
    })
    async formatTheHandle(parameters: FormatUrlParameterSchema) {
        try {
            const baseUrl = "https://hey.xyz/u/";
            const username = parameters.handle.split("/")[1];
            return `${baseUrl}${username}`;
        } catch (error) {
            throw Error(`Failed to transfer: ${error}`);
        }
    }
}
