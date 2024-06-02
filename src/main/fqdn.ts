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
 * @module fqdn
 */

import { IssueOptions, Message, StringShape } from 'doubter/core';
import { createIssue, toIssueOptions } from 'doubter/utils';
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
  interface StringShape {
    /**
     * Check if the string is a fully qualified domain name (e.g. `domain.com`).
     *
     * @param options The issue options or the issue message.
     * @returns The clone of the shape.
     * @group Plugin Methods
     * @plugin {@link fqdn! plugin-string-format/fqdn}
     */
    fqdn(options?: FQDNOptions | Message): this;
  }
}

export default function enableFQDNFormat(ctor: typeof StringShape): void {
  ctor.prototype.fqdn = function (issueOptions) {
    const {
      requireTLD = true,
      allowUnderscores = false,
      allowTrailingDot = false,
      allowNumericTLD = false,
      allowWildcard = false,
      ignoreMaxLength = false,
    } = toIssueOptions(issueOptions);

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

    return this.addOperation(
      (value, param, options) => {
        if (isFQDN(value, fqdnOptions)) {
          return null;
        }
        return [createIssue(CODE_FORMAT, value, 'Must be a fully qualified domain name', param, options, issueOptions)];
      },
      { type: CODE_FORMAT, param }
    );
  };
}
