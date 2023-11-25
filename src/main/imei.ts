/**
 * The plugin that enhances {@link plugin-string-format!StringShape StringShape} with the
 * [IMEI number](https://en.wikipedia.org/wiki/International_Mobile_Equipment_Identity) check.
 *
 * ```ts
 * import { StringShape } from 'doubter/core';
 * import enableIMEIFormat from '@doubter/plugin-string-format/imei';
 *
 * enableIMEIFormat(StringShape);
 * ```
 *
 * @module plugin-string-format/imei
 */

import { Any, IssueOptions, Message, StringShape } from 'doubter/core';
import { createIssueFactory, extractOptions } from 'doubter/utils';
import isIMEI from 'validator/lib/isIMEI.js';
import { CODE_FORMAT } from './constants';

export interface IMEIOptions extends IssueOptions {
  /**
   * If `true` then IMEI with hyphens is considered valid.
   *
   * @default false
   */
  allowHyphens?: boolean;
}

declare module 'doubter/core' {
  export interface Messages {
    /**
     * @default "Must be an IMEI number"
     */
    'string.format.imei': Message | Any;
  }

  interface StringShape {
    /**
     * Check if the string is a valid
     * [IMEI number](https://en.wikipedia.org/wiki/International_Mobile_Equipment_Identity).
     *
     * @param options The constraint options or an issue message.
     * @returns The clone of the shape.
     * @group Plugin Methods
     * @plugin {@link plugin-string-format/imei! plugin-string-format/imei}
     */
    imei(options?: IMEIOptions | Message): this;
  }
}

export default function enableIMEIFormat(ctor: typeof StringShape): void {
  ctor.messages['string.format.imei'] = 'Must be an IMEI number';

  ctor.prototype.imei = function (options) {
    const { allowHyphens = false } = extractOptions(options);

    const param = { format: 'imei', allowHyphens };

    const imeiOptions = { allow_hyphens: allowHyphens };

    const issueFactory = createIssueFactory(CODE_FORMAT, ctor.messages['string.format.imei'], options, param);

    return this.addOperation(
      (value, param, options) => {
        if (isIMEI(value, imeiOptions)) {
          return null;
        }
        return [issueFactory(value, options)];
      },
      { type: CODE_FORMAT, param }
    );
  };
}
