import type {
	IExecuteFunctions,
	IHttpRequestMethods,
	IHttpRequestOptions,
	IDataObject,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
	JsonObject,
} from 'n8n-workflow';
import { NodeApiError, NodeConnectionTypes, NodeOperationError } from 'n8n-workflow';

export class Beszel implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Beszel',
		name: 'beszel',
		icon: { light: 'file:beszel.svg', dark: 'file:beszel.dark.svg' },
		group: ['input'],
		version: [1],
		subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
		description: 'Read monitored systems and alerts from a Beszel hub',
		defaults: { name: 'Beszel' },
		inputs: [NodeConnectionTypes.Main],
		outputs: [NodeConnectionTypes.Main],
		usableAsTool: true,
		credentials: [{ name: 'beszelApi', required: true }],
		properties: [
			{
				displayName: 'Resource',
				name: 'resource',
				type: 'options',
				noDataExpression: true,
				options: [
					{ name: 'Alert', value: 'alert' },
					{ name: 'System', value: 'system' },
				],
				default: 'system',
			},
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: { show: { resource: ['system'] } },
				options: [
					{ name: 'Get', value: 'get', action: 'Get a system by ID' },
					{ name: 'Get Many', value: 'getMany', action: 'Get all monitored systems' },
				],
				default: 'getMany',
			},
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: { show: { resource: ['alert'] } },
				options: [{ name: 'Get Many', value: 'getMany', action: 'Get all alerts' }],
				default: 'getMany',
			},
			{
				displayName: 'System ID',
				name: 'systemId',
				type: 'string',
				default: '',
				required: true,
				description: 'The record ID of the system (from Get Many)',
				displayOptions: { show: { resource: ['system'], operation: ['get'] } },
			},
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];

		for (let i = 0; i < items.length; i++) {
			try {
				const credentials = await this.getCredentials('beszelApi', i);
				const baseURL = (credentials.baseUrl as string).replace(/\/+$/, '');
				const resource = this.getNodeParameter('resource', i) as string;
				const operation = this.getNodeParameter('operation', i) as string;

				const request = (url: string) =>
					this.helpers.httpRequestWithAuthentication.call(this, 'beszelApi', {
						method: 'GET' as IHttpRequestMethods,
						baseURL,
						url,
						json: true,
					} as IHttpRequestOptions);

				const handlers: Record<string, () => Promise<unknown>> = {
					'system:getMany': () => request('/api/collections/systems/records?perPage=500'),
					'system:get': () =>
						request(
							`/api/collections/systems/records/${encodeURIComponent(
								this.getNodeParameter('systemId', i) as string,
							)}`,
						),
					'alert:getMany': () => request('/api/collections/alerts/records?perPage=500'),
				};

				const handler = handlers[`${resource}:${operation}`];
				if (!handler) {
					throw new NodeOperationError(
						this.getNode(),
						`Unsupported operation "${resource}:${operation}"`,
						{ itemIndex: i },
					);
				}

				const response = (await handler()) as IDataObject;
				const list = response?.items as IDataObject[] | undefined;
				if (Array.isArray(list)) {
					for (const element of list) {
						returnData.push({ json: element, pairedItem: { item: i } });
					}
				} else {
					returnData.push({ json: response, pairedItem: { item: i } });
				}
			} catch (error) {
				if (this.continueOnFail()) {
					returnData.push({ json: { error: (error as Error).message }, pairedItem: { item: i } });
					continue;
				}
				throw new NodeApiError(this.getNode(), error as JsonObject, { itemIndex: i });
			}
		}

		return [returnData];
	}
}
