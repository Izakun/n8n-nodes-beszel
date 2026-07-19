import type {
	IAuthenticateGeneric,
	ICredentialDataDecryptedObject,
	ICredentialTestRequest,
	ICredentialType,
	IDataObject,
	IHttpRequestHelper,
	Icon,
	INodeProperties,
} from 'n8n-workflow';

export class BeszelApi implements ICredentialType {
	name = 'beszelApi';

	displayName = 'Beszel API';

	icon: Icon = { light: 'file:beszel.svg', dark: 'file:beszel.dark.svg' };

	documentationUrl = 'https://beszel.dev';

	properties: INodeProperties[] = [
		{
			displayName: 'Base URL',
			name: 'baseUrl',
			type: 'string',
			default: 'http://beszel:8090',
			required: true,
			placeholder: 'http://beszel:8090',
			description: 'Base URL of the Beszel hub (no trailing slash)',
		},
		{
			displayName: 'Email',
			name: 'email',
			type: 'string',
			default: '',
			required: true,
			description: 'Beszel user email',
		},
		{
			displayName: 'Password',
			name: 'password',
			type: 'string',
			typeOptions: { password: true },
			default: '',
			required: true,
		},
		{
			displayName: 'Session Token',
			name: 'token',
			type: 'hidden',
			typeOptions: { password: true },
			default: '',
		},
	];

	// Beszel runs on PocketBase: exchange email/password for a short-lived token,
	// which n8n caches and injects via `authenticate`.
	async preAuthentication(this: IHttpRequestHelper, credentials: ICredentialDataDecryptedObject) {
		const baseUrl = (credentials.baseUrl as string).replace(/\/+$/, '');
		const res = (await this.helpers.httpRequest({
			method: 'POST',
			url: `${baseUrl}/api/collections/users/auth-with-password`,
			body: { identity: credentials.email, password: credentials.password },
			json: true,
		})) as IDataObject;
		return { token: res.token as string };
	}

	authenticate: IAuthenticateGeneric = {
		type: 'generic',
		properties: {
			headers: {
				Authorization: '={{$credentials.token}}',
			},
		},
	};

	test: ICredentialTestRequest = {
		request: {
			baseURL: '={{$credentials.baseUrl}}',
			url: '/api/collections/systems/records?perPage=1',
		},
	};
}
