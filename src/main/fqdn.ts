/**
 * The plugin that enhances {@link index!StringShape StringShape} with the fully qualified domain name
 * check.
 *
 * ```ts
 * import * as d from 'doubter/core';
 * import '@doubter/plugin-string-format/fqdn';
 *
 * d.string().fqdn();
 * ```
 *
 * @module fqdn
 */

import { IssueOptions, Message, StringShape } from 'doubter/core';
import { createIssue, toIssueOptions } from 'doubter/utils';
import isFQDN from 'validator/lib/isFQDN.js';
import { CODE_FQDN, MESSAGE_FQDN } from './constants';

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

StringShape.prototype.fqdn = function (issueOptions) {
  const {
    requireTLD = true,
    allowUnderscores = false,
    allowTrailingDot = false,
    allowNumericTLD = false,
    allowWildcard = false,
    ignoreMaxLength = false,
  } = toIssueOptions(issueOptions);

  return this.addOperation(
    (value, param, options) => {
      if (
        isFQDN(value, {
          require_tld: param.requireTLD,
          allow_underscores: param.allowUnderscores,
          allow_trailing_dot: param.allowTrailingDot,
          allow_numeric_tld: param.allowNumericTLD,
          allow_wildcard: param.allowWildcard,
          ignore_max_length: param.ignoreMaxLength,
        })
      ) {
        return null;
      }
      return [createIssue(CODE_FQDN, value, MESSAGE_FQDN, param, options, issueOptions)];
    },
    {
      type: CODE_FQDN,
      param: {
        requireTLD,
        allowUnderscores,
        allowTrailingDot,
        allowNumericTLD,
        allowWildcard,
        ignoreMaxLength,
      },
    }
  );
};
