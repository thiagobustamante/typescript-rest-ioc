import { Container, } from 'typescript-ioc';

import factory from '../../src/typescript-rest-ioc';
import { OnlyInstantiableByContainer } from 'typescript-ioc/dist/decorators';

jest.mock('typescript-ioc');

const mockGet = Container.get as jest.Mock;

describe('create()', () => {
    beforeEach(() => {
        mockGet.mockClear();
    });

    it('should ask Container for instances', async () => {
        class MyService { }
        const resolved = { a: 'type' };
        mockGet.mockReturnValue(resolved);

        expect(factory.create(MyService)).toEqual(resolved);
        expect(mockGet).toBeCalledWith(MyService);
    });
});

describe('getTargetClass()', () => {
    beforeEach(() => {
        mockGet.mockClear();
    });

    it('return null if receives an array', async () => {
        expect(factory.getTargetClass([] as any)).toEqual(null);
    });

    it('return the own type when receive a simple type', async () => {
        class MyService { }
        expect(factory.getTargetClass(MyService)).toEqual(MyService);
    });

    it('return the correct type when the constructor is instrumented', async () => {
        @OnlyInstantiableByContainer
        class MyService { }
        expect(factory.getTargetClass(MyService)).toEqual((MyService as any)['__parent']);
    });

    it('report an error if receive an invalid constructor', async () => {
        const MyService: any = { a: 'type' };
        expect(() => factory.getTargetClass(MyService))
            .toThrow(new TypeError('Can not identify the base Type for requested target'));
    });
});