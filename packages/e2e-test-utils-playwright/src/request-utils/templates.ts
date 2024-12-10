/**
 * Internal dependencies
 */
import type { RequestUtils } from './index';

type TemplateType = 'wp_template' | 'wp_template_part';

interface Template {
	wp_id: number;
	id: string;
	title: string;
	slug: string;
}

interface CreateTemplatePayload {
	slug: string;
	title?: string;
	content?: string;
	description?: string;
}

const PATH_MAPPING = {
	wp_template: '/wp/v2/templates',
	wp_template_part: '/wp/v2/template-parts',
};

/**
 * Delete all the templates of given type.
 *
 * @param this
 * @param type - Template type to delete.
 */
async function deleteAllTemplates( this: RequestUtils, type: TemplateType ) {
	const path = PATH_MAPPING[ type ];

	if ( ! path ) {
		throw new Error( `Unsupported template type: ${ type }.` );
	}

	const templates = await this.rest< Template[] >( { path } );

	for ( const template of templates ) {
		if ( ! template?.id || ! template?.wp_id ) {
			continue;
		}

		try {
			await this.rest( {
				method: 'DELETE',
				path: `${ path }/${ template.id }`,
				params: { force: true },
			} );
		} catch ( responseError ) {
			// Disable reason - the error provides valuable feedback about issues with tests.
			// eslint-disable-next-line no-console
			console.warn(
				`deleteAllTemplates failed to delete template (id: ${ template.wp_id }) with the following error`,
				responseError
			);
		}
	}
}

/**
 * Creates a new template using the REST API.
 *
 * @param this
 * @param type    Template type to delete.
 * @param payload Template attributes.
 */
async function createTemplate(
	this: RequestUtils,
	type: TemplateType,
	payload: CreateTemplatePayload
) {
	const template = await this.rest< Template >( {
		method: 'POST',
		path: PATH_MAPPING[ type ],
		params: { ...payload, type, status: 'publish', is_wp_suggestion: true },
	} );

	return template;
}

/**
 * Updates a template using the REST API.
 *
 * @param this
 * @param type    Template type.
 * @param payload Template attributes.
 */
async function updateTemplate(
	this: RequestUtils,
	type: TemplateType,
	payload: CreateTemplatePayload
) {
	const path = PATH_MAPPING[ type ];

	if ( ! path ) {
		throw new Error( `Unsupported template type: ${ type }.` );
	}

	const templates = await this.rest< Template[] >( { path } );

	const template = templates.find( ( t ) => t.slug === payload.slug );

	if ( ! template ) {
		throw new Error( `Template with slug "${ payload.slug }" not found.` );
	}

	const updatedTemplate = await this.rest< Template >( {
		method: 'POST',
		path: `${ PATH_MAPPING[ type ] }/${ template.id }`,
		params: { ...payload, type, status: 'publish', is_wp_suggestion: true },
	} );

	return updatedTemplate;
}

export { deleteAllTemplates, createTemplate, updateTemplate };
