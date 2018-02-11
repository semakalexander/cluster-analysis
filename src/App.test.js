import { assert } from 'chai';

import { sum } from './utilities/common';
import { euclidean, euclideanSquare, manhattan } from './utilities/distances';

describe('common utilities', () => {
    it('add two undetermined numbers', () => {
        const numbers = [1,2,3,4];

        assert.equal(sum(...numbers), 10)
    });
});

describe('distances', () => {
    it('finds euclidean distance', () => {
        const v1 = [1,2,3,4];
        const v2 = [0,2,4,4];

        assert.equal(euclidean(v1, v2), Math.sqrt(2));
    });

    it('finds euclideanSquare distance', () => {
        const v1 = [2,2,3,4];
        const v2 = [0,2,4,4];

        assert.equal(euclideanSquare(v1, v2), 5);
    });

    it('finds manhattan distance', () => {
        const v1 = [1,2,3,4];
        const v2 = [0,2,4,4];

        assert.equal(manhattan(v1, v2), 2);
    });
});

