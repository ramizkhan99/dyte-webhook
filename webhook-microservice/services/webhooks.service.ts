"use strict";
import { Context, Service, ServiceBroker, ServiceSchema } from "moleculer";

import DbConnection from "../mixins/db.mixin";

import dotenv from "dotenv";
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
							async handler(
								ctx: Context<{ ipAddress: string }>
							) {},
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
}