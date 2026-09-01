import { PrismaClient } from "@prisma/client";

export type DatabaseClient = Omit<
    PrismaClient,
    "$connect" |
    "$disconnect" |
    "$on" |
    "$transaction" |
    "$extends" |
    "$use"
>;