#!/usr/bin/env node
import {render} from 'ink';
import meow from 'meow';
import App from './app.js';

const cli = meow(
	{
		importMeta: import.meta,
		flags: {
			resetKey: {
				type: "boolean",
			},
		},
	},
);

render(<App resetKey={cli.flags.resetKey ?? false} />);
