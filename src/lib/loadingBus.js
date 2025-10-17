// Lightweight global loading event bus for network and image operations

class LoadingBus extends EventTarget {
  constructor() {
    super();
    this.networkPending = 0;
    this.imagePending = 0;
  }

  get isLoading() {
    return this.networkPending > 0 || this.imagePending > 0;
  }

  _emit() {
    this.dispatchEvent(
      new CustomEvent("change", {
        detail: {
          networkPending: this.networkPending,
          imagePending: this.imagePending,
          isLoading: this.isLoading,
        },
      })
    );
  }

  incNetwork() {
    this.networkPending += 1;
    this._emit();
  }

  decNetwork() {
    if (this.networkPending > 0) this.networkPending -= 1;
    this._emit();
  }

  incImage() {
    this.imagePending += 1;
    this._emit();
  }

  decImage() {
    if (this.imagePending > 0) this.imagePending -= 1;
    this._emit();
  }
}

export const loadingBus = new LoadingBus();




