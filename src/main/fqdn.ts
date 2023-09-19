/**
 * The plugin that enhances {@link plugin-string-format!StringShape StringShape} with the fully qualified domain name
 * check.
 *
 * ```ts
 * import { StringShape } from 'doubter/core';
 * import enableFQDNFormat from '@doubter/plugin-string-format/fqdn';
 *
 * enableFQDNFormat(StringShape.prototype);
 * ```
 *
 * @module plugin-string-format/fqdn
 */

import { IssueOptions, Message, StringShape } from 'doubter/core';
import { createIssueFactory, extractOptions } from 'doubter/utils';
import isFQDN from 'validator/lib/isFQDN.js';
import { CODE_FORMAT, FORMAT_FQDN, MESSAGE_FQDN } from './internal/constants';

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
     * @param options The constraint options or an issue message.
     * @returns The clone of the shape.
     * @group Plugin Methods
     * @plugin {@link plugin-string-format/fqdn! plugin-string-format/fqdn}
     */
    fqdn(options?: FQDNOptions | Message): this;
  }
}

export default function enableFQDNFormat(prototype: StringShape): void {
  prototype.fqdn = function (options) {
    const {
      requireTLD = true,
      allowUnderscores = false,
      allowTrailingDot = false,
      allowNumericTLD = false,
      allowWildcard = false,
      ignoreMaxLength = false,
    } = extractOptions(options);

    const param = {
      format: FORMAT_FQDN,
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

    const issueFactory = createIssueFactory(CODE_FORMAT, MESSAGE_FQDN, options, param);

    return this.use(
      next => (input, output, options, issues) => {
        if (!isFQDN(input, fqdnOptions)) {
          (issues ||= []).push(issueFactory(output, options));

          if (options.earlyReturn) {
            return issues;
          }
        }
        return next(input, output, options, issues);
      },
      { type: CODE_FORMAT, param }
    );
  };
}
