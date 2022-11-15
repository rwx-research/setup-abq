# setup-abq

This is a GitHub action for installing `abq`.

## Inputs

### `access-token`

Your RWX Access Token. See https://www.rwx.com/docs/access-tokens

## Example usage

```yaml
uses: rwx-research/setup-abq@v1
with:
  access-token: ${{ secrets.RWX_ACCESS_TOKEN }}
```
