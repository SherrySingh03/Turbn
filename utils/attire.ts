import type { AttireContext, TopType } from '../types';

export function attireContextToTopType(context: AttireContext): TopType {
    switch (context) {
        case 'casual':
            return 'tshirt';
        case 'formal':
            return 'shirt';
        case 'ceremonial':
            return 'kurta';
        default:
            return 'tshirt';
    }
}

export function topTypeLabelForPrompt(topType: TopType): string {
    switch (topType) {
        case 'tshirt':
            return 'casual t-shirt';
        case 'shirt':
            return 'collared formal shirt';
        case 'kurta':
            return 'traditional kurta (paired with pajama)';
        default:
            return topType;
    }
}
