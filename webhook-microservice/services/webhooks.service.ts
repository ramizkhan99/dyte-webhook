"use strict";
import { Context, Service, ServiceBroker, ServiceSchema } from "moleculer";

import DbConnection from "../mixins/db.mixin";

import dotenv from "dotenv";
import { errorHandler } from "../moleculer.config";
dotenv.config();

export default class WebhooksService extends Service {
	private DbMixin = new DbConnection("webhooks").start();

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
						list: {
							rest: "GET /",
							// @ts-ignore
							async handler(ctx: Context<{}> = {}) {
								const docs = await this.adapter.find();
								return docs;
							},
						},
						update: {
							// #TODO: Continue from here
							rest: "GET /update",
							handler(
								ctx: Context<{
									id: string;
									newTargetURL: string;
								}>
							) {
								return "Just a test";
							},
						},
						trigger: {
							rest: "GET /trigger",
							async handler(
								ctx: Context<{ ipAddress: string }>
							) {},
						},
						register: {
							rest: "POST /register",
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
}
