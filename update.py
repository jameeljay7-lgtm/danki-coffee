import re

with open('index.html', 'r', encoding='utf-8') as f:
    html = f.read()

def update_card(match):
    card_html = match.group(0)
    
    is_250g = '250g' in card_html
    is_500g = '500g' in card_html
    is_1kg = '1kg' in card_html
    
    if is_250g:
        bg_img = 'assets/brown-bag.jpg'
        size_class = 'bag-250g'
    elif is_500g:
        bg_img = 'assets/black-bag.jpg'
        size_class = 'bag-500g'
    else:
        bg_img = 'assets/black-bag.jpg'
        size_class = 'bag-1kg'
        
    card_html = re.sub(r'class="product-image\s*[^"]*"', f'class="product-image {size_class}"', card_html)
    card_html = re.sub(r'background-image:\s*url\([^)]+\)', f"background-image: url('{bg_img}')", card_html)
    
    return card_html

new_html = re.sub(r'<div class="product-card">.*?</div>\s*</div>', update_card, html, flags=re.DOTALL)

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(new_html)

css = '''
.bag-250g {
    height: 200px !important;
}
.bag-500g {
    height: 280px !important;
}
.bag-1kg {
    height: 380px !important;
}
'''
with open('styles.css', 'a', encoding='utf-8') as f:
    f.write(css)

print('Updated HTML and CSS.')
