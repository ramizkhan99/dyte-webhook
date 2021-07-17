"use strict";
import { Context, Service, ServiceBroker, ServiceSchema } from "moleculer";
import async from "async";
import axios from "axios";
// import axiosRetry from "axios-retry";
import fs from "fs";

import DbConnection from "../mixins/db.mixin";

import dotenv from "dotenv";
import { error } from "console";
dotenv.config();

export default class WebhooksService extends Service {
	private DbMixin = new DbConnection("webhooks").start();
	public triggerResults: Object[] = [];

	// @ts-ignore
	public constructor(
		public broker: ServiceBroker,
		// @ts-ignore
		schema: ServiceSchema<{}> = {}
	) {
		super(broker);
		this.parseServiceSchema(
			Service.mergeSchemas(
				{
					name: "webhooks",
					mixins: [this.DbMixin],
					settings: {
						fields: ["_id", "targetURL"],
					},
					actions: {
						find: false,
						count: false,
						create: false,
						insert: false,
						remove: false,
						get: false,
						delete: {
							rest: "DELETE /",
							async handler(ctx: Context<{ id: string }>) {
								const deleted = await this.adapter.removeById(
									ctx.params.id
								);
								if (!deleted) {
									return {
										message: "No such webhooks",
									};
								}
								return {
									message: "Webhook deleted successfully",
								};
							},
						},
						list: {
							rest: "GET /",
							// @ts-ignore
							async handler(ctx: Context<{}> = {}) {
								const docs = await this.adapter.find();
								return docs;
							},
						},
						update: {
							rest: "PUT /",
							async handler(
								ctx: Context<{
									id: string;
									newTargetURL: string;
								}>
							) {
								const doc = await this.adapter.updateById(
									ctx.params.id,
									{
										$set: {
											targetURL: ctx.params.newTargetURL,
										},
									}
								);
								const json = await this.transformDocuments(
									ctx,
									ctx.params,
									doc
								);
								await this.entityChanged("updated", json, ctx);

								return json;
							},
						},
						trigger: {
							rest: "GET /trigger",
							async handler(ctx: Context<{ ipAddress: string }>) {
								const docs = await this.adapter.find();
								const functionArray = docs.map((doc: any) => {
									return () =>
										this.makeRequest(
											doc.targetURL,
											ctx.params.ipAddress
										);
								});
								async.parallelLimit(functionArray, 10);

								return {
									message:
										"Webhook Trigger activated. Please find report file in the microservice folder",
								};
							},
						},
						register: {
							rest: "POST /",
							params: {
								targetURL: "string",
							},
							/** @param {Context} ctx  */
							async handler(ctx: Context<{ targetURL: string }>) {
								const doc = await this.adapter.insert({
									targetURL: ctx.params.targetURL,
								});
								return {
									id: doc._id,
								};
							},
						},
					},
				},
				schema
			)
		);
	}

	public async makeRequest(url: string, ipAddress: string) {
		const timestamp = Date.now();
		// axiosRetry(axios, {
		// 	retries: 5,
		// 	retryCondition: (error) => {
		// 		return error.response.status != 200;
		// 	},
		// });
		const result = await axios
			.post(
				url,
				{
					ipAddress,
					timestamp,
				},
				{
					headers: {
						"Content-Type": "application/json",
					},
				}
			)
			.then((response) => {
				console.log({ result: response.data });
				return response.data;
			})
			.catch((err) => {
				console.log({ error: err.message });
				return {
					error: err,
				};
			});
		const data =
			JSON.stringify(
				{
					ip: ipAddress,
					timestamp,
					result,
				},
				null,
				4
			) + "\n";
		fs.writeFile("TriggerReport.log", data, { flag: "a+" }, (err) => {
			if (err) console.log(err);
		});
	}
}
