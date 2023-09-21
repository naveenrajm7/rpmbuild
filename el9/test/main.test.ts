import { describe, expect, test } from '@jest/globals';
import { main } from '../src/main';

describe('sum module', () => {
    test('adds 1 + 2 to equal 3', () => {
        expect(main.run(1, 2)).toBe(3);
    });
});
