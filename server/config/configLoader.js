/**
 * CRMFloat Configuration Loader
 * 
 * Loads and merges business configuration based on selected industry package.
 * Priority: custom.config.js > industry.config.js > default.config.js
 */

const path = require('path');
const fs = require('fs');

class ConfigLoader {
  constructor() {
    this.config = null;
    this.configPath = path.join(__dirname, '../../config');
  }

  /**
   * Load configuration based on environment or custom file
   */
  load() {
    try {
      // 1. Load default configuration
      const defaultConfig = this.loadFile('default.config.js');
      
      // 2. Check for industry package from environment
      const industryType = process.env.INDUSTRY_PACKAGE || process.env.BUSINESS_TYPE;
      let industryConfig = {};
      
      if (industryType && industryType !== 'generic') {
        try {
          industryConfig = this.loadFile(`${industryType}.config.js`);
          console.log(`✅ Loaded industry package: ${industryType}`);
        } catch (err) {
          console.warn(`⚠️  Industry package '${industryType}' not found, using default`);
        }
      }
      
      // 3. Check for custom configuration (highest priority)
      let customConfig = {};
      const customConfigPath = path.join(this.configPath, 'custom.config.js');
      if (fs.existsSync(customConfigPath)) {
        customConfig = require(customConfigPath);
        console.log(`✅ Loaded custom configuration`);
      }
      
      // 4. Merge configurations (custom > industry > default)
      this.config = this.deepMerge(
        defaultConfig,
        industryConfig,
        customConfig
      );
      
      console.log(`📋 Configuration loaded successfully`);
      console.log(`   Business Type: ${this.config.business.type}`);
      console.log(`   Industry: ${this.config.business.industry}`);
      if (this.config.business.packageName) {
        console.log(`   Package: ${this.config.business.packageName}`);
      }
      
      return this.config;
    } catch (error) {
      console.error('❌ Error loading configuration:', error);
      throw error;
    }
  }

  /**
   * Load a specific configuration file
   */
  loadFile(filename) {
    const filePath = path.join(this.configPath, filename);
    if (!fs.existsSync(filePath)) {
      throw new Error(`Configuration file not found: ${filename}`);
    }
    return require(filePath);
  }

  /**
   * Deep merge multiple configuration objects
   */
  deepMerge(...objects) {
    const isObject = obj => obj && typeof obj === 'object' && !Array.isArray(obj);
    
    return objects.reduce((prev, obj) => {
      Object.keys(obj).forEach(key => {
        const pVal = prev[key];
        const oVal = obj[key];
        
        if (Array.isArray(pVal) && Array.isArray(oVal)) {
          prev[key] = [...pVal, ...oVal];
        } else if (isObject(pVal) && isObject(oVal)) {
          prev[key] = this.deepMerge(pVal, oVal);
        } else {
          prev[key] = oVal;
        }
      });
      
      return prev;
    }, {});
  }

  /**
   * Get current configuration
   */
  getConfig() {
    if (!this.config) {
      this.load();
    }
    return this.config;
  }

  /**
   * Get specific configuration section
   */
  get(section) {
    const config = this.getConfig();
    return section.split('.').reduce((obj, key) => obj?.[key], config);
  }

  /**
   * Check if a module is enabled
   */
  isModuleEnabled(moduleName) {
    return this.get(`modules.${moduleName}.enabled`) === true;
  }

  /**
   * Get workflow stages
   */
  getWorkflowStages(pipelineName = null) {
    const pipeline = pipelineName || this.get('workflow.defaultPipeline');
    return this.get(`workflow.pipelines.${pipeline}.stages`) || [];
  }

  /**
   * Get Kanban columns
   */
  getKanbanColumns() {
    return this.get('workflow.kanban.columns') || [];
  }

  /**
   * Get custom fields for a model
   */
  getCustomFields(modelName) {
    return this.get(`fields.${modelName}.custom`) || [];
  }

  /**
   * Get terminology
   */
  getTerminology(term) {
    return this.get(`terminology.${term}`) || { singular: term, plural: `${term}s` };
  }

  /**
   * Reload configuration (useful for runtime updates)
   */
  reload() {
    // Clear require cache for config files
    Object.keys(require.cache).forEach(key => {
      if (key.includes('/config/') && key.endsWith('.config.js')) {
        delete require.cache[key];
      }
    });
    
    this.config = null;
    return this.load();
  }
}

// Export singleton instance
const configLoader = new ConfigLoader();
module.exports = configLoader;

