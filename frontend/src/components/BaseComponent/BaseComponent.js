/*********************************************************************
 * BaseComponent.js from CS326 frontend integration example tasks-v2
 * All rendered components should extend BaseComponent
 *********************************************************************/

export class BaseComponent {
    constructor() {
      this.cssLoaded = false;
    }
  
    /**
     * This is an abstract method that must be implemented by child classes.
     * It must return an HTMLElement object.
     * @abstract
     * @returns {HTMLElement}
     */
    render() {
      throw new Error('render method not implemented');
    }
  
    loadCSS(fileName) {
      if (this.cssLoaded) return;
  
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      // Dynamically load CSS from the same directory as the JS file
      link.href = `../../components/${fileName}/${fileName}.css`; // EDIT FROM CLASS EXAMPLE: adjust file path for compatibility with our folder structure
      
      document.head.appendChild(link);
      this.cssLoaded = true;
    }
  
    dispatchCustomEvent(eventName, detail = {}) {
      const event = new CustomEvent(eventName, { detail });
      this.parent.dispatchEvent(event);
    }
  
    listenToEvent(eventName, callback) {
      this.parent.addEventListener(eventName, callback);
    }
  }
  
