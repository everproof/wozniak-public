module Jekyll
  module Filters
    module ArrayChunkFilter
      def chunk_array(input, chunk_size)
        # input: an array
        # chunk_size: the size of each chunk to cut the array down to
        # output: the chunked array
        input.each_slice(chunk_size).to_a
      end
    end
  end
end

Liquid::Template.register_filter(Jekyll::Filters::ArrayChunkFilter)