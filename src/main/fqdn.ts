/**
 * The plugin that enhances {@link plugin-string-format!StringShape StringShape} with the fully qualified domain name
 * check.
 *
 * ```ts
 * import { StringShape } from 'doubter/core';
 * import enableFQDNFormat from '@doubter/plugin-string-format/fqdn';
 *
 * enableFQDNFormat(StringShape);
 * ```
 *
 * @module plugin-string-format/fqdn
 */

import { Any, IssueOptions, Message, StringShape } from 'doubter/core';
import { createIssueFactory, extractOptions } from 'doubter/utils';
import isFQDN from 'validator/lib/isFQDN.js';
import { CODE_FORMAT } from './constants';

export interface FQDNOptions extends IssueOptions {
  /**
   * @default true
   */
  requireTLD?: boolean;

  /**
   * @default false
   */
  allowUnderscores?: boolean;

  /**
   * @default false
   */
  allowTrailingDot?: boolean;

  /**
   * @default false
   */
  allowNumericTLD?: boolean;

  /**
   * If allow domain starting with `*.` (e.g. `*.example.com` or `*.shop.example.com`).
   *
   * @default false
   */
  allowWildcard?: boolean;

  /**
   * @default false
   */
  ignoreMaxLength?: boolean;
}

declare module 'doubter/core' {
  export interface Messages {
    /**
     * @default "Must be a fully qualified domain name"
     */
    'string.format.fqdn': Message | Any;
  }

  interface StringShape {
    /**
     * Check if the string is a fully qualified domain name (e.g. `domain.com`).
     *
     * @param options The issue options or the issue message.
     * @returns The clone of the shape.
     * @group Plugin Methods
     * @plugin {@link plugin-string-format/fqdn! plugin-string-format/fqdn}
     */
    fqdn(options?: FQDNOptions | Message): this;
  }
}

export default function enableFQDNFormat(ctor: typeof StringShape): void {
  ctor.messages['string.format.fqdn'] = 'Must be a fully qualified domain name';

  ctor.prototype.fqdn = function (options) {
    const {
      requireTLD = true,
      allowUnderscores = false,
      allowTrailingDot = false,
      allowNumericTLD = false,
      allowWildcard = false,
      ignoreMaxLength = false,
    } = extractOptions(options);

    const param = {
      format: 'fqdn',
      requireTLD,
      allowUnderscores,
      allowTrailingDot,
      allowNumericTLD,
      allowWildcard,
      ignoreMaxLength,
    };

    const fqdnOptions = {
      require_tld: requireTLD,
      allow_underscores: allowUnderscores,
      allow_trailing_dot: allowTrailingDot,
      allow_numeric_tld: allowNumericTLD,
      allow_wildcard: allowWildcard,
      ignore_max_length: ignoreMaxLength,
    };

    const issueFactory = createIssueFactory(CODE_FORMAT, ctor.messages['string.format.fqdn'], options, param);

    return this.addOperation(
      (value, param, options) => {
        if (isFQDN(value, fqdnOptions)) {
          return null;
        }
        return [issueFactory(value, options)];
      },
      { type: CODE_FORMAT, param }
    );
  };
}
