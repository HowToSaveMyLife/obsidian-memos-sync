import { Attachment } from "@/api/memos-v0.25.1-adapter";

export type APIResource = {
	name?: string;
	externalLink?: string;
	type?: string;
	uid?: string;
	id: string;
	filename: string;
};

export function convert0220ResourceToAPIResource(
	attachment: Attachment
): APIResource {
	return {
		id: attachment.name.replace("resources/", "").replace("attachments/", ""),
		filename: attachment.filename,
		externalLink: attachment.externalLink,
		name: attachment.name,
		type: attachment.type,
		uid: attachment.uid,
	};
}

export function generateResourceName(resource: APIResource): string {
	return `${resource.id}-${resource.filename.replace(/[/\\?%*:|"<>]/g, "-")}`;
}

export function generateResourceLink(resource: APIResource): string {
	if (!resource.externalLink) {
		return `![[${generateResourceName(resource)}]]`;
	}

	const prefix = resource.type?.includes("image") ? "!" : ""; // only add ! for image type

	return `${prefix}[${resource.name || resource.filename}](${
		resource.externalLink
	})`;
}
