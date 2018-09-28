(function () {

  const Columns = Object.freeze({
    LEFT: 'LEFT',
    MIDDLE: 'MIDDLE',
    RIGHT: 'RIGHT'
  });

  function Panel(id, name, template) {
    this.element = Paperclips.ViewManager.getTemplate('panelTemplate', id, {
      '.panel__title': name,
      '.panel__content': template
    });
  }

  Panel.prototype.getElement = function getElement() {
    return this.element;
  }

  Panel.prototype.getContent = function getContent() {
    return this.element.querySelector('.panel__content');
  }

  Panel.prototype.isShown = function isShown() {
    return this.element.className.indexOf('hidden') < 0;
  };

  Panel.prototype.show = function show() {
    this.element.className = 'panel';
  };

  Panel.prototype.hide = function hide() {
    this.element.className = 'panel hidden';
  };

  Panel.prototype.update = function update(contentBySelector) {
    const content = this.getContent();
    for (let selector in contentBySelector) {
      content.querySelector(selector).innerHTML = contentBySelector[selector];
    }
  };

  function ViewManager () {
    this.panelsById = {};
  }

  ViewManager.Columns = Columns;
  ViewManager.Panel = Panel;

  ViewManager.prototype.getTemplate = function getTemplate(templateId, newId, valuesBySelector) {
    const templateEl = document.querySelector('#' + templateId).cloneNode(true);
    templateEl.setAttribute('id', newId);

    if (valuesBySelector) {
      for (let selector in valuesBySelector) {
        templateEl.querySelector(selector).innerHTML = valuesBySelector[selector];
      }
    }

    return templateEl;
  }

  ViewManager.prototype.inject = function inject(templates) {
    const templateContainerEl = document.querySelector('#templates');
    let templateSource = '\n';

    if (typeof templates === 'string') {
      templateContainerEl.innerHTML += templates;
      return;
    }

    for (let template of templates) {
      templateSource += template;
    }

    templateContainerEl.innerHTML += templateSource;
  }

  /**
   * Instantiates a new panel and adds it to the DOM. The panel is populated with
   * the content of a specified template and is initially hidden. You can update
   * the content within a panel in a render function.
   * @param {ViewManager.Columns} column The column to add the view to
   * @param {String} id A unique ID for the panel to be identified by
   * @param {String} name The displayed name of the panel
   * @param {String} template The name of a template to be rendered as the content
   * @return {ViewManager.Panel} A panel instance to be used for controlling the panel
   */
  ViewManager.prototype.addPanel = function addPanel(id, { column, name, template, renderer }) {
    const panel = new Panel(id, name, template);

    this.panelsById[id] = panel;
    this.getPanelContainer(column).appendChild(panel.getElement());

    if (renderer) {
      Paperclips.game.onRender(panelRenderer(id, renderer));
    }

    return panel;
  }

  ViewManager.prototype.getPanel = function getPanel(id) {
    return this.panelsById[id];
  }

  /**
   * @private
   */
  ViewManager.prototype.getPanelContainer = function getPanelContainer(column) {
    const idsByColumn = {
      [Columns.LEFT]: '#leftColumn',
      [Columns.MIDDLE]: '#middleColumn',
      [Columns.RIGHT]: '#rightColumn'
    };

    return document.querySelector(idsByColumn[column]);
  }

  window.ViewManager = ViewManager;
})();
