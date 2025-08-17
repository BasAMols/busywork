import { Flex } from './flex';

export class Screen extends Flex {
    public constructor(public readonly key: string) {
        super({
            justifyContent: 'center',
            alignItems: 'center',
            flexDirection: 'column',
            style: {
                width: '100%',
                height: '100%', backgroundColor: '#2a3e48',
                transition: 'transform 0.6s ease-in-out',
            }, classList: ['screen'],
        });
    }
}
