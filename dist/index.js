module.exports =
/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ 352:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const os = __importStar(__webpack_require__(87));
const utils_1 = __webpack_require__(605);
/**
 * Commands
 *
 * Command Format:
 *   ::name key=value,key=value::message
 *
 * Examples:
 *   ::warning::This is the message
 *   ::set-env name=MY_VAR::some value
 */
function issueCommand(command, properties, message) {
    const cmd = new Command(command, properties, message);
    process.stdout.write(cmd.toString() + os.EOL);
}
exports.issueCommand = issueCommand;
function issue(name, message = '') {
    issueCommand(name, {}, message);
}
exports.issue = issue;
const CMD_STRING = '::';
class Command {
    constructor(command, properties, message) {
        if (!command) {
            command = 'missing.command';
        }
        this.command = command;
        this.properties = properties;
        this.message = message;
    }
    toString() {
        let cmdStr = CMD_STRING + this.command;
        if (this.properties && Object.keys(this.properties).length > 0) {
            cmdStr += ' ';
            let first = true;
            for (const key in this.properties) {
                if (this.properties.hasOwnProperty(key)) {
                    const val = this.properties[key];
                    if (val) {
                        if (first) {
                            first = false;
                        }
                        else {
                            cmdStr += ',';
                        }
                        cmdStr += `${key}=${escapeProperty(val)}`;
                    }
                }
            }
        }
        cmdStr += `${CMD_STRING}${escapeData(this.message)}`;
        return cmdStr;
    }
}
function escapeData(s) {
    return utils_1.toCommandValue(s)
        .replace(/%/g, '%25')
        .replace(/\r/g, '%0D')
        .replace(/\n/g, '%0A');
}
function escapeProperty(s) {
    return utils_1.toCommandValue(s)
        .replace(/%/g, '%25')
        .replace(/\r/g, '%0D')
        .replace(/\n/g, '%0A')
        .replace(/:/g, '%3A')
        .replace(/,/g, '%2C');
}
//# sourceMappingURL=command.js.map

/***/ }),

/***/ 564:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const command_1 = __webpack_require__(352);
const file_command_1 = __webpack_require__(598);
const utils_1 = __webpack_require__(605);
const os = __importStar(__webpack_require__(87));
const path = __importStar(__webpack_require__(622));
/**
 * The code to exit an action
 */
var ExitCode;
(function (ExitCode) {
    /**
     * A code indicating that the action was successful
     */
    ExitCode[ExitCode["Success"] = 0] = "Success";
    /**
     * A code indicating that the action was a failure
     */
    ExitCode[ExitCode["Failure"] = 1] = "Failure";
})(ExitCode = exports.ExitCode || (exports.ExitCode = {}));
//-----------------------------------------------------------------------
// Variables
//-----------------------------------------------------------------------
/**
 * Sets env variable for this action and future actions in the job
 * @param name the name of the variable to set
 * @param val the value of the variable. Non-string values will be converted to a string via JSON.stringify
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function exportVariable(name, val) {
    const convertedVal = utils_1.toCommandValue(val);
    process.env[name] = convertedVal;
    const filePath = process.env['GITHUB_ENV'] || '';
    if (filePath) {
        const delimiter = '_GitHubActionsFileCommandDelimeter_';
        const commandValue = `${name}<<${delimiter}${os.EOL}${convertedVal}${os.EOL}${delimiter}`;
        file_command_1.issueCommand('ENV', commandValue);
    }
    else {
        command_1.issueCommand('set-env', { name }, convertedVal);
    }
}
exports.exportVariable = exportVariable;
/**
 * Registers a secret which will get masked from logs
 * @param secret value of the secret
 */
function setSecret(secret) {
    command_1.issueCommand('add-mask', {}, secret);
}
exports.setSecret = setSecret;
/**
 * Prepends inputPath to the PATH (for this action and future actions)
 * @param inputPath
 */
function addPath(inputPath) {
    const filePath = process.env['GITHUB_PATH'] || '';
    if (filePath) {
        file_command_1.issueCommand('PATH', inputPath);
    }
    else {
        command_1.issueCommand('add-path', {}, inputPath);
    }
    process.env['PATH'] = `${inputPath}${path.delimiter}${process.env['PATH']}`;
}
exports.addPath = addPath;
/**
 * Gets the value of an input.  The value is also trimmed.
 *
 * @param     name     name of the input to get
 * @param     options  optional. See InputOptions.
 * @returns   string
 */
function getInput(name, options) {
    const val = process.env[`INPUT_${name.replace(/ /g, '_').toUpperCase()}`] || '';
    if (options && options.required && !val) {
        throw new Error(`Input required and not supplied: ${name}`);
    }
    return val.trim();
}
exports.getInput = getInput;
/**
 * Sets the value of an output.
 *
 * @param     name     name of the output to set
 * @param     value    value to store. Non-string values will be converted to a string via JSON.stringify
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function setOutput(name, value) {
    command_1.issueCommand('set-output', { name }, value);
}
exports.setOutput = setOutput;
/**
 * Enables or disables the echoing of commands into stdout for the rest of the step.
 * Echoing is disabled by default if ACTIONS_STEP_DEBUG is not set.
 *
 */
function setCommandEcho(enabled) {
    command_1.issue('echo', enabled ? 'on' : 'off');
}
exports.setCommandEcho = setCommandEcho;
//-----------------------------------------------------------------------
// Results
//-----------------------------------------------------------------------
/**
 * Sets the action status to failed.
 * When the action exits it will be with an exit code of 1
 * @param message add error issue message
 */
function setFailed(message) {
    process.exitCode = ExitCode.Failure;
    error(message);
}
exports.setFailed = setFailed;
//-----------------------------------------------------------------------
// Logging Commands
//-----------------------------------------------------------------------
/**
 * Gets whether Actions Step Debug is on or not
 */
function isDebug() {
    return process.env['RUNNER_DEBUG'] === '1';
}
exports.isDebug = isDebug;
/**
 * Writes debug message to user log
 * @param message debug message
 */
function debug(message) {
    command_1.issueCommand('debug', {}, message);
}
exports.debug = debug;
/**
 * Adds an error issue
 * @param message error issue message. Errors will be converted to string via toString()
 */
function error(message) {
    command_1.issue('error', message instanceof Error ? message.toString() : message);
}
exports.error = error;
/**
 * Adds an warning issue
 * @param message warning issue message. Errors will be converted to string via toString()
 */
function warning(message) {
    command_1.issue('warning', message instanceof Error ? message.toString() : message);
}
exports.warning = warning;
/**
 * Writes info to log with console.log.
 * @param message info message
 */
function info(message) {
    process.stdout.write(message + os.EOL);
}
exports.info = info;
/**
 * Begin an output group.
 *
 * Output until the next `groupEnd` will be foldable in this group
 *
 * @param name The name of the output group
 */
function startGroup(name) {
    command_1.issue('group', name);
}
exports.startGroup = startGroup;
/**
 * End an output group.
 */
function endGroup() {
    command_1.issue('endgroup');
}
exports.endGroup = endGroup;
/**
 * Wrap an asynchronous function call in a group.
 *
 * Returns the same type as the function itself.
 *
 * @param name The name of the group
 * @param fn The function to wrap in the group
 */
function group(name, fn) {
    return __awaiter(this, void 0, void 0, function* () {
        startGroup(name);
        let result;
        try {
            result = yield fn();
        }
        finally {
            endGroup();
        }
        return result;
    });
}
exports.group = group;
//-----------------------------------------------------------------------
// Wrapper action state
//-----------------------------------------------------------------------
/**
 * Saves state for current action, the state can only be retrieved by this action's post job execution.
 *
 * @param     name     name of the state to store
 * @param     value    value to store. Non-string values will be converted to a string via JSON.stringify
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function saveState(name, value) {
    command_1.issueCommand('save-state', { name }, value);
}
exports.saveState = saveState;
/**
 * Gets the value of an state set by this action's main execution.
 *
 * @param     name     name of the state to get
 * @returns   string
 */
function getState(name) {
    return process.env[`STATE_${name}`] || '';
}
exports.getState = getState;
//# sourceMappingURL=core.js.map

/***/ }),

/***/ 598:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

// For internal use, subject to change.
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
// We use any as a valid input type
/* eslint-disable @typescript-eslint/no-explicit-any */
const fs = __importStar(__webpack_require__(747));
const os = __importStar(__webpack_require__(87));
const utils_1 = __webpack_require__(605);
function issueCommand(command, message) {
    const filePath = process.env[`GITHUB_${command}`];
    if (!filePath) {
        throw new Error(`Unable to find environment variable for file command ${command}`);
    }
    if (!fs.existsSync(filePath)) {
        throw new Error(`Missing file at path: ${filePath}`);
    }
    fs.appendFileSync(filePath, `${utils_1.toCommandValue(message)}${os.EOL}`, {
        encoding: 'utf8'
    });
}
exports.issueCommand = issueCommand;
//# sourceMappingURL=file-command.js.map

/***/ }),

/***/ 605:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

// We use any as a valid input type
/* eslint-disable @typescript-eslint/no-explicit-any */
Object.defineProperty(exports, "__esModule", ({ value: true }));
/**
 * Sanitizes an input into a string so it can be passed into issueCommand safely
 * @param input input to sanitize into a string
 */
function toCommandValue(input) {
    if (input === null || input === undefined) {
        return '';
    }
    else if (typeof input === 'string' || input instanceof String) {
        return input;
    }
    return JSON.stringify(input);
}
exports.toCommandValue = toCommandValue;
//# sourceMappingURL=utils.js.map

/***/ }),

/***/ 5:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


const os = __webpack_require__(87);
const path = __webpack_require__(622);
const childProcess = __webpack_require__(129);

/**
 * Absolute path to the sentry-cli binary (platform dependent).
 * @type {string}
 */
// istanbul ignore next
let binaryPath = __webpack_require__.ab + "sentry-cli";
/**
 * Overrides the default binary path with a mock value, useful for testing.
 *
 * @param {string} mockPath The new path to the mock sentry-cli binary
 */
function mockBinaryPath(mockPath) {
  binaryPath = mockPath;
}

/**
 * The javascript type of a command line option.
 * @typedef {'array'|'string'|'boolean'|'inverted-boolean'} OptionType
 */

/**
 * Schema definition of a command line option.
 * @typedef {object} OptionSchema
 * @prop {string} param The flag of the command line option including dashes.
 * @prop {OptionType} type The value type of the command line option.
 */

/**
 * Schema definition for a command.
 * @typedef {Object.<string, OptionSchema>} OptionsSchema
 */

/**
 * Serializes command line options into an arguments array.
 *
 * @param {OptionsSchema} schema An options schema required by the command.
 * @param {object} options An options object according to the schema.
 * @returns {string[]} An arguments array that can be passed via command line.
 */
function serializeOptions(schema, options) {
  return Object.keys(schema).reduce((newOptions, option) => {
    const paramValue = options[option];
    if (paramValue === undefined) {
      return newOptions;
    }

    const paramType = schema[option].type;
    const paramName = schema[option].param;

    if (paramType === 'array') {
      if (!Array.isArray(paramValue)) {
        throw new Error(`${option} should be an array`);
      }

      return newOptions.concat(
        paramValue.reduce((acc, value) => acc.concat([paramName, String(value)]), [])
      );
    }

    if (paramType === 'boolean') {
      if (typeof paramValue !== 'boolean') {
        throw new Error(`${option} should be a bool`);
      }

      const invertedParamName = schema[option].invertedParam;

      if (paramValue && paramName !== undefined) {
        return newOptions.concat([paramName]);
      }

      if (!paramValue && invertedParamName !== undefined) {
        return newOptions.concat([invertedParamName]);
      }

      return newOptions;
    }

    return newOptions.concat(paramName, paramValue);
  }, []);
}

/**
 * Serializes the command and its options into an arguments array.
 *
 * @param {string} command The literal name of the command.
 * @param {OptionsSchema} [schema] An options schema required by the command.
 * @param {object} [options] An options object according to the schema.
 * @returns {string[]} An arguments array that can be passed via command line.
 */
function prepareCommand(command, schema, options) {
  return command.concat(serializeOptions(schema || {}, options || {}));
}

/**
 * Returns the absolute path to the `sentry-cli` binary.
 * @returns {string}
 */
function getPath() {
  return __webpack_require__.ab + "sentry-cli";
}

/**
 * Runs `sentry-cli` with the given command line arguments.
 *
 * Use {@link prepareCommand} to specify the command and add arguments for command-
 * specific options. For top-level options, use {@link serializeOptions} directly.
 *
 * The returned promise resolves with the standard output of the command invocation
 * including all newlines. In order to parse this output, be sure to trim the output
 * first.
 *
 * If the command failed to execute, the Promise rejects with the error returned by the
 * CLI. This error includes a `code` property with the process exit status.
 *
 * @example
 * const output = await execute(['--version']);
 * expect(output.trim()).toBe('sentry-cli x.y.z');
 *
 * @param {string[]} args Command line arguments passed to `sentry-cli`.
 * @param {boolean} live We inherit stdio to display `sentry-cli` output directly.
 * @param {boolean} silent Disable stdout for silents build (CI/Webpack Stats, ...)
 * @param {string} [configFile] Relative or absolute path to the configuration file.
 * @param {Object} [config] More configuration to pass to the CLI
 * @returns {Promise.<string>} A promise that resolves to the standard output.
 */
function execute(args, live, silent, configFile, config = {}) {
  const env = { ...process.env };
  if (configFile) {
    env.SENTRY_PROPERTIES = configFile;
  }
  if (config.url) {
    env.SENTRY_URL = config.url;
  }
  if (config.authToken) {
    env.SENTRY_AUTH_TOKEN = config.authToken;
  }
  if (config.apiKey) {
    env.SENTRY_API_KEY = config.apiKey;
  }
  if (config.dsn) {
    env.SENTRY_DSN = config.dsn;
  }
  if (config.org) {
    env.SENTRY_ORG = config.org;
  }
  if (config.project) {
    env.SENTRY_PROJECT = config.project;
  }
  if (config.vcsRemote) {
    env.SENTRY_VCS_REMOTE = config.vcsRemote;
  }
  return new Promise((resolve, reject) => {
    if (live === true) {
      const pid = childProcess.spawn(getPath(), args, {
        env,
        stdio: ['inherit', silent ? 'pipe' : 'inherit', 'inherit'],
      });
      pid.on('exit', () => {
        resolve();
      });
    } else {
      childProcess.execFile(getPath(), args, { env }, (err, stdout) => {
        if (err) {
          reject(err);
        } else {
          resolve(stdout);
        }
      });
    }
  });
}

function getProjectFlagsFromOptions({ projects = [] } = {}) {
  return projects.reduce((flags, project) => flags.concat('-p', project), []);
}

module.exports = {
  mockBinaryPath,
  serializeOptions,
  prepareCommand,
  getPath,
  execute,
  getProjectFlagsFromOptions,
};


/***/ }),

/***/ 365:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


const pkgInfo = __webpack_require__(328);
const helper = __webpack_require__(5);
const Releases = __webpack_require__(548);

/**
 * Interface to and wrapper around the `sentry-cli` executable.
 *
 * Commands are grouped into namespaces. See the respective namespaces for more
 * documentation. To use this wrapper, simply create an instance and call methods:
 *
 * @example
 * const cli = new SentryCli();
 * console.log(cli.getVersion());
 *
 * @example
 * const cli = new SentryCli('path/to/custom/sentry.properties');
 * console.log(cli.getVersion());
 */
class SentryCli {
  /**
   * Creates a new `SentryCli` instance.
   *
   * If the `configFile` parameter is specified, configuration located in the default
   * location and the value specified in the `SENTRY_PROPERTIES` environment variable is
   * overridden.
   *
   * @param {string} [configFile] Relative or absolute path to the configuration file.
   * @param {Object} [options] More options to pass to the CLI
   */
  constructor(configFile, options) {
    if (typeof configFile === 'string') {
      this.configFile = configFile;
    }
    this.options = options || { silent: false };
    this.releases = new Releases({ ...this.options, configFile });
  }

  /**
   * Returns the version of the installed `sentry-cli` binary.
   * @returns {string}
   */
  static getVersion() {
    return pkgInfo.version;
  }

  /**
   * Returns an absolute path to the `sentry-cli` binary.
   * @returns {string}
   */
  static getPath() {
    return helper.getPath();
  }

  /**
   * See {helper.execute} docs.
   * @param {string[]} args Command line arguments passed to `sentry-cli`.
   * @param {boolean} live We inherit stdio to display `sentry-cli` output directly.
   * @returns {Promise.<string>} A promise that resolves to the standard output.
   */
  execute(args, live) {
    return helper.execute(args, live, this.options.silent, this.configFile, this.options);
  }
}

module.exports = SentryCli;


/***/ }),

/***/ 548:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


const helper = __webpack_require__(5);

/**
 * Default arguments for the `--ignore` option.
 * @type {string[]}
 */
const DEFAULT_IGNORE = ['node_modules'];

/**
 * Schema for the `upload-sourcemaps` command.
 * @type {OptionsSchema}
 */
const SOURCEMAPS_SCHEMA = __webpack_require__(33);

/**
 * Schema for the `deploys new` command.
 * @type {OptionsSchema}
 */
const DEPLOYS_SCHEMA = __webpack_require__(270);

/**
 * Manages releases and release artifacts on Sentry.
 * @namespace SentryReleases
 */
class Releases {
  /**
   * Creates a new `Releases` instance.
   *
   * @param {Object} [options] More options to pass to the CLI
   */
  constructor(options) {
    this.options = options || {};
    if (typeof this.options.configFile === 'string') {
      this.configFile = this.options.configFile;
    }
    delete this.options.configFile;
  }

  /**
   * Registers a new release with sentry.
   *
   * The given release name should be unique and deterministic. It can later be used to
   * upload artifacts, such as source maps.
   *
   * @param {string} release Unique name of the new release.
   * @param {object} options A set of options when creating a release.
   * @param {array} options.projects The list of project slugs for a release.
   * @returns {Promise} A promise that resolves when the release has been created.
   * @memberof SentryReleases
   */
  new(release, options) {
    const args = ['releases', 'new', release].concat(helper.getProjectFlagsFromOptions(options));
    return this.execute(args, null);
  }

  /**
   * Specifies the set of commits covered in this release.
   *
   * @param {string} release Unique name of the release
   * @param {object} options A set of options to configure the commits to include
   * @param {string} options.repo The full repo name as defined in Sentry
   * @param {boolean} options.auto Automatically choose the associated commit (uses
   * the current commit). Overrides other options.
   * @param {string} options.commit The current (last) commit in the release.
   * @param {string} options.previousCommit The commit before the beginning of this
   * release (in other words, the last commit of the previous release). If omitted,
   * this will default to the last commit of the previous release in Sentry. If there
   * was no previous release, the last 10 commits will be used.
   * @returns {Promise} A promise that resolves when the commits have been associated
   * @memberof SentryReleases
   */
  setCommits(release, options) {
    if (!options || (!options.auto && (!options.repo || !options.commit))) {
      throw new Error('options.auto, or options.repo and options.commit must be specified');
    }

    let commitFlags = [];

    if (options.auto) {
      commitFlags = ['--auto'];
    } else if (options.previousCommit) {
      commitFlags = ['--commit', `${options.repo}@${options.previousCommit}..${options.commit}`];
    } else {
      commitFlags = ['--commit', `${options.repo}@${options.commit}`];
    }

    return this.execute(['releases', 'set-commits', release].concat(commitFlags));
  }

  /**
   * Marks this release as complete. This should be called once all artifacts has been
   * uploaded.
   *
   * @param {string} release Unique name of the release.
   * @returns {Promise} A promise that resolves when the release has been finalized.
   * @memberof SentryReleases
   */
  finalize(release) {
    return this.execute(['releases', 'finalize', release], null);
  }

  /**
   * Creates a unique, deterministic version identifier based on the project type and
   * source files. This identifier can be used as release name.
   *
   * @returns {Promise.<string>} A promise that resolves to the version string.
   * @memberof SentryReleases
   */
  proposeVersion() {
    return this.execute(['releases', 'propose-version'], null).then(
      version => version && version.trim()
    );
  }

  /**
   * Scans the given include folders for JavaScript source maps and uploads them to the
   * specified release for processing.
   *
   * The options require an `include` array, which is a list of directories to scan.
   * Additionally, it supports to ignore certain files, validate and preprocess source
   * maps and define a URL prefix.
   *
   * @example
   * await cli.releases.uploadSourceMaps(cli.releases.proposeVersion(), {
   *   // required options:
   *   include: ['build'],
   *
   *   // default options:
   *   ignore: ['node_modules'],  // globs for files to ignore
   *   ignoreFile: null,          // path to a file with ignore rules
   *   rewrite: false,            // preprocess sourcemaps before uploading
   *   sourceMapReference: true,  // add a source map reference to source files
   *   stripPrefix: [],           // remove certain prefices from filenames
   *   stripCommonPrefix: false,  // guess common prefices to remove from filenames
   *   validate: false,           // validate source maps and cancel the upload on error
   *   urlPrefix: '',             // add a prefix source map urls after stripping them
   *   urlSuffix: '',             // add a suffix source map urls after stripping them
   *   ext: ['js', 'map', 'jsbundle', 'bundle'],  // override file extensions to scan for
   *   projects: ['node']        // provide a list of projects
   * });
   *
   * @param {string} release Unique name of the release.
   * @param {object} options Options to configure the source map upload.
   * @returns {Promise} A promise that resolves when the upload has completed successfully.
   * @memberof SentryReleases
   */
  uploadSourceMaps(release, options) {
    if (!options || !options.include) {
      throw new Error('options.include must be a vaild path(s)');
    }

    const uploads = options.include.map(sourcemapPath => {
      const newOptions = { ...options };
      if (!newOptions.ignoreFile && !newOptions.ignore) {
        newOptions.ignore = DEFAULT_IGNORE;
      }

      const args = ['releases']
        .concat(helper.getProjectFlagsFromOptions(options))
        .concat(['files', release, 'upload-sourcemaps', sourcemapPath]);
      return this.execute(helper.prepareCommand(args, SOURCEMAPS_SCHEMA, newOptions), true);
    });

    return Promise.all(uploads);
  }

  /**
   * List all deploys for a given release.
   *
   * @param {string} release Unique name of the release.
   * @returns {Promise} A promise that resolves when the list comes back from the server.
   * @memberof SentryReleases
   */
  listDeploys(release) {
    return this.execute(['releases', 'deploys', release, 'list'], null);
  }

  /**
   * Creates a new release deployment. This should be called after the release has been
   * finalized, while deploying on a given environment.
   *
   * @example
   * await cli.releases.newDeploy(cli.releases.proposeVersion(), {
   *   // required options:
   *   env: 'production',          // environment for this release. Values that make sense here would be 'production' or 'staging'
   *
   *   // optional options:
   *   started: 42,                // unix timestamp when the deployment started
   *   finished: 1337,             // unix timestamp when the deployment finished
   *   time: 1295,                 // deployment duration in seconds. This can be specified alternatively to `started` and `finished`
   *   name: 'PickleRick',         // human readable name for this deployment
   *   url: 'https://example.com', // URL that points to the deployment
   * });
   *
   * @param {string} release Unique name of the release.
   * @param {object} options Options to configure the new release deploy.
   * @returns {Promise} A promise that resolves when the deploy has been created.
   * @memberof SentryReleases
   */
  newDeploy(release, options) {
    if (!options || !options.env) {
      throw new Error('options.env must be a vaild name');
    }
    const args = ['releases', 'deploys', release, 'new'];
    return this.execute(helper.prepareCommand(args, DEPLOYS_SCHEMA, options), null);
  }

  /**
   * See {helper.execute} docs.
   * @param {string[]} args Command line arguments passed to `sentry-cli`.
   * @param {boolean} live We inherit stdio to display `sentry-cli` output directly.
   * @returns {Promise.<string>} A promise that resolves to the standard output.
   */
  execute(args, live) {
    return helper.execute(args, live, this.options.silent, this.configFile, this.options);
  }
}

module.exports = Releases;


/***/ }),

/***/ 270:
/***/ ((module) => {

module.exports = {
  env: {
    param: '--env',
    type: 'string',
  },
  started: {
    param: '--started',
    type: 'number',
  },
  finished: {
    param: '--finished',
    type: 'number',
  },
  time: {
    param: '--time',
    type: 'number',
  },
  name: {
    param: '--name',
    type: 'string',
  },
  url: {
    param: '--url',
    type: 'string',
  },
};


/***/ }),

/***/ 33:
/***/ ((module) => {

module.exports = {
  ignore: {
    param: '--ignore',
    type: 'array',
  },
  ignoreFile: {
    param: '--ignore-file',
    type: 'string',
  },
  dist: {
    param: '--dist',
    type: 'string',
  },
  rewrite: {
    param: '--rewrite',
    invertedParam: '--no-rewrite',
    type: 'boolean',
  },
  sourceMapReference: {
    invertedParam: '--no-sourcemap-reference',
    type: 'boolean',
  },
  stripPrefix: {
    param: '--strip-prefix',
    type: 'array',
  },
  stripCommonPrefix: {
    param: '--strip-common-prefix',
    type: 'boolean',
  },
  validate: {
    param: '--validate',
    type: 'boolean',
  },
  urlPrefix: {
    param: '--url-prefix',
    type: 'string',
  },
  urlSuffix: {
    param: '--url-suffix',
    type: 'string',
  },
  ext: {
    param: '--ext',
    type: 'array',
  },
};


/***/ }),

/***/ 699:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const core = __webpack_require__(564);
const SentryCli = __webpack_require__(365);
const {runCommand} = __webpack_require__(719);

const run = async () => {
  try {
    const cli = new SentryCli();

    // Get the inputs from the workflow file: https://github.com/actions/toolkit/tree/master/packages/core#inputsoutputs
    const tagName = core.getInput('tagName', {
      required: true,
    });
    const environment = core.getInput('environment', {
      required: true,
    });
    const releaseNamePrefix = core.getInput('releaseNamePrefix', {
      required: false,
    });

    // This removes the 'refs/tags' portion of the string, i.e. from 'refs/tags/v1.0.0' to 'v1.0.0'
    const tag = tagName.replace('refs/tags/', '');
    let releaseName = tag;

    if (releaseNamePrefix) {
      releaseName = `${releaseNamePrefix}${tag}`;
    }

    core.info(`Tag is: ${tag}`);
    core.info(`Sentry release is: ${releaseName}`);

    // Create a release
    await cli.releases.new(releaseName);

    // Set commits

    const commit = core.getInput('commit', {
      required: false,
    });
    const repo =
      core.getInput('repo', {
        required: false,
      }) || 'repo';
    const commitsOptions = commit ? {repo, commit} : {repo: 'repo', auto: true};

    await cli.releases.setCommits(releaseName, commitsOptions);

    /* istanbul ignore next */
    const sourceMapOptions = core.getInput('sourceMapOptions', {
      required: false,
    });

    /* istanbul ignore next */
    if (sourceMapOptions) {
      await cli.releases.uploadSourceMaps(releaseName, JSON.parse(sourceMapOptions));
    }

    // Create a deployment (A node.js function isn't exposed for this operation.)
    const sentryCliPath = SentryCli.getPath();

    core.info(`sentryCliPath: ${sentryCliPath}`);
    await runCommand(sentryCliPath, ['releases', 'deploys', releaseName, 'new', '-e', environment]);

    // Finalize the release
    await cli.releases.finalize(releaseName);
  } catch (error) {
    core.setFailed(error.message);
  }
};

module.exports = run;


/***/ }),

/***/ 860:
/***/ ((__unused_webpack_module, __unused_webpack_exports, __webpack_require__) => {

const run = __webpack_require__(699);

if (require.main === require.cache[eval('__filename')]) {
  run();
}


/***/ }),

/***/ 719:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const {execFile} = __webpack_require__(129);

// eslint-disable-next-line require-await
const runCommand = async (filePath, args) => {
  return new Promise((resolve, reject) => {
    execFile(filePath, args, (error, stdout) => {
      if (error) {
        reject(error);
      }

      resolve(stdout);
    });
  });
};

module.exports = {
  runCommand,
};


/***/ }),

/***/ 328:
/***/ ((module) => {

"use strict";
module.exports = JSON.parse("{\"_args\":[[\"@sentry/cli@1.59.0\",\"/Users/edvinasbartkus/projects/sentry-releases-action\"]],\"_from\":\"@sentry/cli@1.59.0\",\"_id\":\"@sentry/cli@1.59.0\",\"_inBundle\":false,\"_integrity\":\"sha512-9nK4uVHW7HIbOwFZNvHRWFJcD+bqjW3kMWK2UUMqQWse0Lf3xM+2o+REGGkk0S69+E4elSiukVjUPTI5aijNlA==\",\"_location\":\"/@sentry/cli\",\"_phantomChildren\":{},\"_requested\":{\"type\":\"version\",\"registry\":true,\"raw\":\"@sentry/cli@1.59.0\",\"name\":\"@sentry/cli\",\"escapedName\":\"@sentry%2fcli\",\"scope\":\"@sentry\",\"rawSpec\":\"1.59.0\",\"saveSpec\":null,\"fetchSpec\":\"1.59.0\"},\"_requiredBy\":[\"/\"],\"_resolved\":\"https://registry.npmjs.org/@sentry/cli/-/cli-1.59.0.tgz\",\"_spec\":\"1.59.0\",\"_where\":\"/Users/edvinasbartkus/projects/sentry-releases-action\",\"bin\":{\"sentry-cli\":\"bin/sentry-cli\"},\"bugs\":{\"url\":\"https://github.com/getsentry/sentry-cli/issues\"},\"dependencies\":{\"https-proxy-agent\":\"^5.0.0\",\"mkdirp\":\"^0.5.5\",\"node-fetch\":\"^2.6.0\",\"progress\":\"^2.0.3\",\"proxy-from-env\":\"^1.1.0\"},\"description\":\"A command line utility to work with Sentry. https://docs.sentry.io/hosted/learn/cli/\",\"devDependencies\":{\"eslint\":\"^6.8.0\",\"eslint-config-airbnb-base\":\"^14.1.0\",\"eslint-config-prettier\":\"^6.10.1\",\"eslint-plugin-import\":\"^2.20.2\",\"jest\":\"^25.3.0\",\"npm-run-all\":\"^4.1.5\",\"prettier\":\"^1.19.1\"},\"engines\":{\"node\":\">= 8\"},\"homepage\":\"https://docs.sentry.io/hosted/learn/cli/\",\"jest\":{\"collectCoverage\":true,\"testEnvironment\":\"node\",\"testPathIgnorePatterns\":[\"src/utils\"]},\"keywords\":[\"sentry\",\"sentry-cli\",\"cli\"],\"license\":\"BSD-3-Clause\",\"main\":\"js/index.js\",\"name\":\"@sentry/cli\",\"repository\":{\"type\":\"git\",\"url\":\"git+https://github.com/getsentry/sentry-cli.git\"},\"scripts\":{\"fix\":\"npm-run-all fix:eslint fix:prettier\",\"fix:eslint\":\"eslint --fix bin/* scripts/**/*.js js/**/*.js\",\"fix:prettier\":\"prettier --write bin/* scripts/**/*.js js/**/*.js\",\"install\":\"node scripts/install.js\",\"test\":\"npm-run-all test:jest test:eslint test:prettier\",\"test:eslint\":\"eslint bin/* scripts/**/*.js js/**/*.js\",\"test:jest\":\"jest\",\"test:prettier\":\"prettier --check  bin/* scripts/**/*.js js/**/*.js\",\"test:watch\":\"jest --watch --notify\"},\"version\":\"1.59.0\"}");

/***/ }),

/***/ 129:
/***/ ((module) => {

"use strict";
module.exports = require("child_process");;

/***/ }),

/***/ 747:
/***/ ((module) => {

"use strict";
module.exports = require("fs");;

/***/ }),

/***/ 87:
/***/ ((module) => {

"use strict";
module.exports = require("os");;

/***/ }),

/***/ 622:
/***/ ((module) => {

"use strict";
module.exports = require("path");;

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		if(__webpack_module_cache__[moduleId]) {
/******/ 			return __webpack_module_cache__[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		var threw = true;
/******/ 		try {
/******/ 			__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 			threw = false;
/******/ 		} finally {
/******/ 			if(threw) delete __webpack_module_cache__[moduleId];
/******/ 		}
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat */
/******/ 	
/******/ 	__webpack_require__.ab = __dirname + "/";/************************************************************************/
/******/ 	// module exports must be returned from runtime so entry inlining is disabled
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(860);
/******/ })()
;