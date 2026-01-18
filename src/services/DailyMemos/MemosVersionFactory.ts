import { MemosSyncPluginSettings } from "@/types/PluginSettings";
import {
	MemosPaginator,
	MemosPaginator0251,
} from "./MemosPaginator";
import {
	MemosResourceFetcher,
	MemosResourceFetcher0251,
} from "./MemosResourceFetcher";
import { new0251Clients } from "@/api/memos-v0.25.1";
import {
	Clients as Clients0251
} from "@/api/memos-v0.25.1-adapter";

/**
 * MemosPaginatorFactory
 * Create MemosPaginator based on settings
 * Only supports v0.25.1 API version
 */
export class MemosAbstractFactory {
	private inner: MemosFactory0251;

	constructor(private settings: MemosSyncPluginSettings) {
		this.inner = new MemosFactory0251(this.settings);
	}

	createMemosPaginator = (
		lastTime?: string,
		filter?: (
			date: string,
			dailyMemosForDate: Record<string, string>
		) => boolean
	): MemosPaginator => {
		return this.inner.createMemosPaginator(lastTime, filter);
	};

	createResourceFetcher = () => {
		return this.inner.createResourceFetcher();
	};
}

class MemosFactory0251 {
	private client: Clients0251;

	constructor(private settings: MemosSyncPluginSettings) {
		const apiUrl = this.settings.memosAPIURL.endsWith("/")
			? this.settings.memosAPIURL.slice(0, -1)
			: this.settings.memosAPIURL;
		this.client = new0251Clients(apiUrl, this.settings.memosAPIToken);
	}

	createMemosPaginator = (
		lastTime?: string,
		filter?: (
			date: string,
			dailyMemosForDate: Record<string, string>
		) => boolean
	): MemosPaginator => {
		return new MemosPaginator0251(
			this.client.memoListPaginator,
			this.client.authCli,
			lastTime,
			filter
		);
	};

	createResourceFetcher = () => {
		return new MemosResourceFetcher0251(this.client.attachmentCli);
	};
}
