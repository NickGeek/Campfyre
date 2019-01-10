// Globals
let mockStorage = {};
let safeStorage = window.localStorage;
let app;

(() => {
	const CAMPFYRE_ID_STORAGE_KEY = 'campfyreId';

	(function ensureSafeStorage() {
		try {
			safeStorage.setItem('test', '123');
			safeStorage.removeItem('test');
		} catch (_) {
			safeStorage = {
				length: Object.keys(mockStorage).length,
				removeItem: key => { delete mockStorage[key] },
				setItem: (key, value) => { mockStorage[key] = value },
				getItem: key => mockStorage[key],
				clear: () => mockStorage = {}
			}
		}
	})();

	(function startApp() {
		const campfyreId = safeStorage.getItem(CAMPFYRE_ID_STORAGE_KEY);
		app = Elm.Main.init({
			flags: {
				campfyreId,
				postId: 1
			}
		});

		// TODO: Elm-side storage handling
		// app.ports.setCampfyreId.subscribe(id =>
		// 	safeStorage.setItem(CAMPFYRE_ID_STORAGE_KEY, id)
		// );
	})();
})();
