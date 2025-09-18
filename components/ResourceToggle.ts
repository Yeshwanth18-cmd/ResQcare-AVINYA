/**
 * @customElement resource-toggle
 * @attr {string} label - The label for the header. Defaults to "Related Resources".
 * @attr {number} count - The number of resources, used to display in the header.
 * @attr {boolean} expanded - If present, the toggle will be expanded by default.
 * 
 * @slot header - Allows for custom content in the header. Overrides the default label/count.
 * @slot links - The list of links to be shown/hidden.
 * 
 * @csspart header - The header button element.
 * @csspart links - The container for the links slot.
 * 
 * @fires toggle - Dispatched when the toggle state changes. detail: { expanded: boolean }
 */
class ResourceToggle extends HTMLElement {
  private header: HTMLElement;
  private links: HTMLElement;

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.shadowRoot!.innerHTML = `
      <style>
        :host {
          display: block;
          font-family: var(--font-family, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif);
          border: 1px solid var(--color-border, #e2e8f0);
          border-radius: 0.75rem; /* 12px */
          background-color: var(--color-surface, #ffffff);
          transition: box-shadow 0.2s ease-in-out;
        }
        :host(:hover) {
          box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
        }
        [part="header"] {
          display: flex;
          align-items: center;
          width: 100%;
          padding: 0.75rem 1rem; /* 12px 16px */
          background-color: transparent;
          border: none;
          cursor: pointer;
          user-select: none;
          font-weight: 600;
          color: var(--color-text-main, #1e293b);
          text-align: left;
          border-radius: inherit;
        }
        :host([aria-expanded="true"]) [part="header"] {
           border-bottom-left-radius: 0;
           border-bottom-right-radius: 0;
           background-color: var(--color-primary-light, #eff6ff);
           color: var(--color-primary-text, #1e40af);
        }
        [part="header"]:focus-visible {
          outline: 2px solid var(--color-ring, #60a5fa);
          outline-offset: 2px;
        }
        .header-content {
          flex-grow: 1;
        }
        .chevron {
          margin-left: auto;
          transition: transform 0.2s ease-in-out;
          stroke: currentColor;
        }
        :host([aria-expanded="true"]) .chevron {
          transform: rotate(180deg);
        }
        [part="links"] {
          display: grid;
          grid-template-rows: 0fr;
          overflow: hidden;
          transition: grid-template-rows 0.3s ease-in-out;
        }
        :host([aria-expanded="true"]) [part="links"] {
          grid-template-rows: 1fr;
        }
        .links-inner {
            min-height: 0;
        }
        .links-content {
          padding: 0.5rem 1rem 1rem 1rem;
          border-top: 1px solid var(--color-border, #e2e8f0);
        }
        /* Fallback for browsers without JS */
        :host(:not(:defined)) [slot="links"] {
            display: block !important;
        }
      </style>
      <button part="header" id="header" aria-expanded="false" aria-controls="links-container">
        <div class="header-content">
          <slot name="header"></slot>
        </div>
        <svg class="chevron" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <path d="M6 9l6 6 6-6"/>
        </svg>
      </button>
      <div part="links" id="links-container" role="region" aria-labelledby="header" aria-hidden="true">
        <div class="links-inner">
            <div class="links-content">
                <slot name="links"></slot>
            </div>
        </div>
      </div>
    `;

    this.header = this.shadowRoot!.querySelector('#header')!;
    this.links = this.shadowRoot!.querySelector('#links-container')!;
  }

  static get observedAttributes() {
    return ['expanded', 'label', 'count'];
  }

  connectedCallback() {
    this.header.addEventListener('click', this.toggle.bind(this));
    
    // Initial render from attributes
    this._renderHeader();
    const initiallyExpanded = this.hasAttribute('expanded');
    this._setExpanded(initiallyExpanded, false);
  }
  
  attributeChangedCallback(name: string, oldValue: string, newValue: string) {
    if (oldValue === newValue) return;
    switch(name) {
      case 'expanded':
        this._setExpanded(this.hasAttribute('expanded'), true);
        break;
      case 'label':
      case 'count':
        this._renderHeader();
        break;
    }
  }

  private _renderHeader() {
    const headerSlot = this.querySelector('[slot="header"]');
    if (headerSlot) return; // If user provided a header, don't override it

    const label = this.getAttribute('label') || 'Related Resources';
    const count = this.getAttribute('count');
    const defaultHeader = document.createElement('span');
    defaultHeader.slot = 'header';
    defaultHeader.textContent = count ? `${label} (${count})` : label;
    
    // Clear previous default header
    this.querySelector('[slot="header"]')?.remove();
    this.appendChild(defaultHeader);
  }

  private _setExpanded(isExpanded: boolean, notify: boolean) {
    this.toggleAttribute('aria-expanded', isExpanded);
    this.header.setAttribute('aria-expanded', String(isExpanded));
    this.links.setAttribute('aria-hidden', String(!isExpanded)); // Accessibility improvement
    
    if (notify) {
      this.dispatchEvent(new CustomEvent('toggle', {
        bubbles: true,
        composed: true,
        detail: { expanded: isExpanded }
      }));
    }
  }

  toggle() {
    this._setExpanded(!this.hasAttribute('aria-expanded'), true);
  }
}

customElements.define('resource-toggle', ResourceToggle);