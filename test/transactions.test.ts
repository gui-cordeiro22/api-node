// Dependencies
import {
    test,
    beforeAll,
    afterAll,
    describe,
    expect,
    beforeEach,
} from "vitest";
import { execSync } from "node:child_process";
import request from "supertest";

// App
import { app } from "../src/app";

describe("Transactions routes", () => {
    beforeAll(async () => {
        await app.ready();
    });

    afterAll(async () => {
        await app.close();
    });

    beforeEach(() => {
        execSync("npm run knex migrate:rollback --all");
        execSync("npm run knex migrate:latest");
    });

    test("User can create a new transaction", async () => {
        await request(app.server)
            .post("/transactions")
            .send({
                title: "New Transaction",
                amount: 5000,
                type: "credit",
            })
            .expect(201);
    });

    test("User can list all transactions", async () => {
        const createTransactionResponse = await request(app.server)
            .post("/transactions")
            .send({
                title: "New Transaction",
                amount: 5000,
                type: "credit",
            });

        const cookies = createTransactionResponse.get("Set-Cookie")!;

        const listTransactionsResponse = await request(app.server)
            .get("/transactions")
            .set("Cookie", cookies)
            .expect(200);

        expect(listTransactionsResponse.body.transactions).toEqual([
            expect.objectContaining({
                title: "New Transaction",
                amount: 5000,
            }),
        ]);
    });

    test("User can see an especific transaction", async () => {
        const createTransactionResponse = await request(app.server)
            .post("/transactions")
            .send({
                title: "New Transaction",
                amount: 5000,
                type: "credit",
            });

        const cookies = createTransactionResponse.get("Set-Cookie")!;

        const listTransactionsResponse = await request(app.server)
            .get("/transactions")
            .set("Cookie", cookies)
            .expect(200);

        const transactionId = listTransactionsResponse.body.transactions[0].id;

        const getTransactionResponse = await request(app.server)
            .get(`/transactions/${transactionId}`)
            .set("Cookie", cookies)
            .expect(200);

        expect(getTransactionResponse.body.transaction).toEqual(
            expect.objectContaining({
                title: "New Transaction",
                amount: 5000,
            }),
        );
    });

    test("User can get summary", async () => {
        const createTransactionResponse = await request(app.server)
            .post("/transactions")
            .send({
                title: "Credit Transaction",
                amount: 5000,
                type: "credit",
            });

        const cookies = createTransactionResponse.get("Set-Cookie")!;

        await request(app.server)
            .post("/transactions")
            .set("Cookie", cookies)
            .send({
                title: "Debit Transaction",
                amount: 2000,
                type: "debit",
            });

        const suumaryResponse = await request(app.server)
            .get("/transactions/summary")
            .set("Cookie", cookies)
            .expect(200);

        expect(suumaryResponse.body.summary).toEqual({
            amount: 3000,
        });
    });
});
