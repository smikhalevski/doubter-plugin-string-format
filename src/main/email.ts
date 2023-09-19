/**
 * The plugin that enhances {@link plugin-string-format!StringShape StringShape} with the email check.
 *
 * ```ts
 * import { StringShape } from 'doubter/core';
 * import enableEmailFormat from '@doubter/plugin-string-format/email';
 *
 * enableEmailFormat(StringShape.prototype);
 * ```
 *
 * @module plugin-string-format/email
 */

import { IssueOptions, Message, StringShape } from 'doubter/core';
import isEmail from 'validator/lib/isEmail.js';
import { createIssueFactory, extractOptions } from 'doubter/utils';
import { CODE_FORMAT, FORMAT_EMAIL, MESSAGE_EMAIL } from './internal/constants';

export interface EmailOptions extends IssueOptions {
  /**
   * If `true` then display names are allowed (ex. `Display Name <email-address>`).
   *
   * @default false
   */
  allowDisplayName?: boolean;

  /**
   * If `true` then display names are required (ex. `Display Name <email-address>`).
   *
   * @default false
   */
  requireDisplayName?: boolean;

  /**
   * If `false` then` any non-English UTF8 character in the local part of the email address are forbidden.
   *
   * @default true
   */
  allowUTF8LocalPart?: boolean;

  /**
   * If `false` then addresses without a top-level domain are allowed.
   *
   * @default true
   */
  requireTLD?: boolean;

  /**
   * If `true` then the standard max length of an email is ignored.
   *
   * @default false
   */
  ignoreMaxLength?: boolean;

  /**
   * If `true` then IP addresses are allowed in the host part.
   *
   * @default false
   */
  allowIPDomain?: boolean;

  /**
   * Reject emails that include any of the given characters in the name part.
   */
  blacklistedChars?: string;

  /**
   * If the part of the email after the @ symbol matches one of the strings defined in it then the validation fails.
   */
  hostBlacklist?: string[];

  /**
   * Validation succeeds, only if the part of the email after the @ symbol matches one of the strings defined in it.
   */
  hostWhitelist?: string[];
}

declare module 'doubter/core' {
  interface StringShape {
    /**
     * Check if the string is an email.
     *
     * @param options The constraint options or an issue message.
     * @returns The clone of the shape.
     * @group Plugin Methods
     * @plugin {@link plugin-string-format/email! plugin-string-format/email}
     */
    email(options?: EmailOptions | Message): this;
  }
}

export default function enableEmailFormat(prototype: StringShape): void {
  prototype.email = function (options) {
    const {
      requireDisplayName = false,
      allowDisplayName = false,
      allowIPDomain = false,
      allowUTF8LocalPart = true,
      ignoreMaxLength = false,
      hostBlacklist = [],
      hostWhitelist = [],
      requireTLD = true,
      blacklistedChars = '',
    } = extractOptions(options);

    const param = {
      format: FORMAT_EMAIL,
      requireDisplayName,
      allowDisplayName,
      allowIPDomain,
      allowUTF8LocalPart,
      ignoreMaxLength,
      hostBlacklist,
      hostWhitelist,
      requireTLD,
      blacklistedChars,
    };

    const emailOptions = {
      require_display_name: requireDisplayName,
      allow_display_name: allowDisplayName,
      allow_ip_domain: allowIPDomain,
      allow_utf8_local_part: allowUTF8LocalPart,
      ignore_max_length: ignoreMaxLength,
      host_blacklist: hostBlacklist,
      host_whitelist: hostWhitelist,
      require_tld: requireTLD,
      blacklisted_chars: blacklistedChars,
    };

    const issueFactory = createIssueFactory(CODE_FORMAT, MESSAGE_EMAIL, options, param);

    return this.use(
      next => (input, output, options, issues) => {
        if (!isEmail(input, emailOptions)) {
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
