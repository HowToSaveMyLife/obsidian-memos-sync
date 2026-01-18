import * as log from "@/utils/log";
import { AttachmentCli } from "@/api/memos-v0.25.1-adapter";
import { APIResource, convert0220ResourceToAPIResource } from "./MemosResource";

export type MemosResourceFetcher = {
	listResources: () => Promise<APIResource[] | undefined>;
	fetchResource: (resource: APIResource) => Promise<ArrayBuffer | undefined>;
};

export class MemosResourceFetcher0251 {
	constructor(private attachmentCli: AttachmentCli) {}
	listResources = async (): Promise<APIResource[] | undefined> => {
		try {
			const resp = await this.attachmentCli.listAttachments({});
			return resp.attachments.map(convert0220ResourceToAPIResource);
		} catch (error) {
			if (error.response && error.response.status === 404) {
				log.debug(`fetch resources 404: ${origin}/resource`);
				return;
			}
			log.error(error);
			return undefined;
		}
	};

	fetchResource = async (
		resource: APIResource
	): Promise<ArrayBuffer | undefined> => {
		try {
			const resp = await this.attachmentCli.getAttachmentBinary({
				name: resource.name,
				filename: resource.filename,
			});
			return resp.data;
		} catch (error) {
			log.error(error);
			return undefined;
		}
	};
};